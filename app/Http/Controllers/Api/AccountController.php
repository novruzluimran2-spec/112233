<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function orders(Request $request): JsonResponse
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->with(['items.menuItem:id,title'])
            ->latest('id')
            ->limit(20)
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'number' => (string) $order->id,
                'status' => $order->status,
                'total' => round((float) $order->total).' ₽',
                'when' => $order->created_at?->format('d.m.Y H:i'),
                'fulfillment' => $order->delivery_type === 'delivery' ? 'Доставка' : 'Самовывоз',
                'itemsSummary' => $order->items
                    ->map(fn ($item) => ($item->menuItem->title ?? 'Удалено').' ×'.$item->qty)
                    ->join(', '),
            ]);

        return response()->json(['orders' => $orders]);
    }

    public function reservations(Request $request): JsonResponse
    {
        $reservations = Reservation::query()
            ->where('user_id', $request->user()->id)
            ->latest('id')
            ->limit(20)
            ->get()
            ->map(fn (Reservation $r) => [
                'id' => $r->id,
                'name' => $r->name,
                'phone' => $r->phone,
                'date' => $r->date?->format('d.m.Y'),
                'time' => is_string($r->time) ? substr($r->time, 0, 5) : $r->time,
                'guests' => $r->guests,
                'status' => $r->status,
                'note' => $r->note,
            ]);

        return response()->json(['reservations' => $reservations]);
    }
}
