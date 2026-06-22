<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\OrderAdminController;
use App\Http\Controllers\Admin\ReservationAdminController;
use App\Http\Controllers\Admin\MenuAdminController;
use App\Http\Controllers\Api\AuthController as CustomerAuthController;

Route::view('/', 'index');
Route::view('/index.html', 'index');
Route::view('/menu.html', 'menu');
Route::view('/order.html', 'order');
Route::view('/reserve.html', 'reserve');
Route::view('/about.html', 'about');
Route::view('/contacts.html', 'contacts');

Route::post('/api/register', [CustomerAuthController::class, 'register']);
Route::post('/api/login', [CustomerAuthController::class, 'login']);
Route::get('/api/user', [CustomerAuthController::class, 'user']);
Route::post('/api/logout', [CustomerAuthController::class, 'logout']);

Route::get('/admin/login', [AuthController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [AuthController::class, 'login'])->name('admin.login.submit');
Route::post('/admin/logout', [AuthController::class, 'logout'])->name('admin.logout');

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::redirect('/', '/admin/orders');

    Route::get('/orders', [OrderAdminController::class, 'index'])->name('orders.index');
    Route::patch('/orders/{order}/status', [OrderAdminController::class, 'updateStatus'])->name('orders.status');

    Route::get('/reservations', [ReservationAdminController::class, 'index'])->name('reservations.index');
    Route::patch('/reservations/{reservation}/status', [ReservationAdminController::class, 'updateStatus'])->name('reservations.status');

    Route::get('/menu', [MenuAdminController::class, 'index'])->name('menu.index');
    Route::patch('/menu/{menuItem}/toggle', [MenuAdminController::class, 'toggle'])->name('menu.toggle');
});
