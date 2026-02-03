<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Leaderboard;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    /**
     * Submit score (LOGIN WAJIB)
     * POST /api/score
     */
    public function submit(Request $request)
    {
        $request->validate([
            'score' => 'required|integer|min:0',
        ]);

        $user = $request->user();

        // ambil score tertinggi user
        $bestScore = Leaderboard::where('user_id', $user->id)->max('score');

        // simpan hanya jika score lebih tinggi
        if ($request->score > ($bestScore ?? 0)) {
            Leaderboard::create([
                'user_id' => $user->id,
                'score'   => $request->score,
            ]);
        }

        return response()->json([
            'message'    => 'Score berhasil disubmit',
            'best_score' => max($request->score, $bestScore ?? 0),
        ]);
    }

    /**
     * Ambil leaderboard TOP 10
     * GET /api/leaderboard
     */
    public function top()
    {
        $data = Leaderboard::with('user')
            ->orderByDesc('score')
            ->limit(10)
            ->get();

        return response()->json(
            $data->map(function ($item, $index) {
                return [
                    'rank'     => $index + 1,
                    'username' => $item->user->username,
                    'score'    => $item->score,
                ];
            })
        );
    }

    /**
     * Rank player saat ini
     * GET /api/my-rank
     */
    public function myRank(Request $request)
    {
        $user = $request->user();

        $myBest = Leaderboard::where('user_id', $user->id)->max('score');

        if ($myBest === null) {
            return response()->json([
                'rank'  => null,
                'score' => 0,
            ]);
        }

        $rank = Leaderboard::where('score', '>', $myBest)->count() + 1;

        return response()->json([
            'username' => $user->username,
            'rank'     => $rank,
            'score'    => $myBest,
        ]);
    }
}
