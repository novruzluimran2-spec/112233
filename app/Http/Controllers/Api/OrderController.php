<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:32'],
            'delivery_type' => ['required', Rule::in(['delivery', 'pickup'])],
            'address' => ['nullable', 'string'],
            'payment_method' => ['required', 'string', 'max:32'],
            'note' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.menu_item_id' => ['required', 'integer', 'exists:menu_items,id'],
            'items.*.qty' => ['required', 'integer', 'min:1', 'max:100'],
        ]);

        if (($data['delivery_type'] ?? null) === 'delivery' && empty(trim((string) ($data['address'] ?? '')))) {
            return response()->json([
                'message' => 'Укажите адрес доставки.',
                'errors' => ['address' => ['Укажите адрес доставки.']],
            ], 422);
        }

        $items = collect($data['items'])
            ->map(fn ($i) => [
                'menu_item_id' => (int) $i['menu_item_id'],
                'qty' => (int) $i['qty'],
            ])
            ->groupBy('menu_item_id')
            ->map(fn ($rows) => $rows->sum('qty'))
            ->map(fn ($qty, $menuItemId) => ['menu_item_id' => (int) $menuItemId, 'qty' => (int) $qty])
            ->values();

        $menuItems = MenuItem::query()
            ->whereIn('id', $items->pluck('menu_item_id'))
            ->where('is_available', true)
            ->get(['id', 'price', 'title']);

        if ($menuItems->count() !== $items->count()) {
            return response()->json([
                'message' => 'Некоторые блюда недоступны.',
            ], 422);
        }

        /** @var array<int, MenuItem> $byId */
        $byId = $menuItems->keyBy('id')->all();

        $total = 0.0;
        foreach ($items as $row) {
            $mi = $byId[$row['menu_item_id']];
            $total += ((float) $mi->price) * $row['qty'];
        }

        $order = DB::transaction(function () use ($data, $items, $byId, $total, $request) {
            $order = Order::query()->create([
                'user_id' => $request->user()->id,
                'customer_name' => $data['customer_name'],
                'phone' => $data['phone'],
                'delivery_type' => $data['delivery_type'],
                'address' => $data['delivery_type'] === 'delivery' ? $data['address'] : null,
                'payment_method' => $data['payment_method'],
                'note' => $data['note'] ?? null,
                'total' => $total,
                'status' => 'new',
            ]);

            foreach ($items as $row) {
                $mi = $byId[$row['menu_item_id']];
                OrderItem::query()->create([
                    'order_id' => $order->id,
                    'menu_item_id' => $mi->id,
                    'qty' => $row['qty'],
                    'price' => $mi->price,
                ]);
            }

            return $order;
        });

        return response()->json([
            'id' => $order->id,
            'status' => $order->status,
            'total' => $order->total,
        ], 201);
    }
}

