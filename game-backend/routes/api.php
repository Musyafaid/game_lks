<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LeaderboardController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/score', [LeaderboardController::class, 'submit']);
    Route::get('/leaderboard', [LeaderboardController::class, 'top']);
    Route::get('/my-rank', [LeaderboardController::class, 'myRank']);
});
