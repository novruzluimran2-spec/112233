<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:32'],
            'date' => ['required', 'date'],
            'time' => ['required', 'date_format:H:i'],
            'guests' => ['required', 'integer', 'min:1', 'max:20'],
            'note' => ['nullable', 'string'],
        ]);

        $date = Carbon::parse($data['date'])->startOfDay();
        if ($date->lt(now()->startOfDay())) {
            return response()->json([
                'message' => 'Дата бронирования не может быть в прошлом.',
                'errors' => ['date' => ['Дата бронирования не может быть в прошлом.']],
            ], 422);
        }

        $user = $request->user();

        $reservation = Reservation::query()->create([
            'user_id' => $user->id,
            'name' => $data['name'],
            'phone' => $data['phone'],
            'date' => $data['date'],
            'time' => $data['time'],
            'guests' => $data['guests'],
            'note' => $data['note'] ?? null,
            'status' => 'new',
        ]);

        return response()->json([
            'id' => $reservation->id,
            'status' => $reservation->status,
        ], 201);
    }
}

