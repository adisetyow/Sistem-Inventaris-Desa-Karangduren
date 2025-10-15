<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\Activitylog\Models\Activity;

class LogAktivitasController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // Query ke model Activity dari Spatie
        $query = Activity::with(['causer.roles', 'subject']);

        // Filter berdasarkan event (created, updated, deleted)
        $query->when($request->event, function ($q, $event) {
            return $q->where('event', $event);
        });

        // Filter berdasarkan pencarian (nama user atau deskripsi)
        $query->when($request->search, function ($q, $search) {
            return $q->where('description', 'like', "%{$search}%")
                ->orWhereHas('causer', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%");
                });
        });

        $logs = $query->latest()->paginate(20)->withQueryString();

        return response()->json(['status' => 'success', 'data' => $logs]);
    }
}