<?php

use App\Http\Controllers\Api\MenuController;
use Illuminate\Support\Facades\Route;

Route::get('/menu', [MenuController::class, 'index']);

