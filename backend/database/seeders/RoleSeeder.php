<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Buat roles
        Role::create(['name' => 'super-admin']);
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'viewer']);


        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@desa.com',
            'password' => Hash::make('super123')
        ]);
        $superAdmin->assignRole('super-admin');


        $admin = User::create([
            'name' => 'Admin Desa',
            'email' => 'admin@desa.com',
            'password' => Hash::make('admin123')
        ]);
        $admin->assignRole('admin');


        $viewer = User::create([
            'name' => 'Viewer Desa',
            'email' => 'viewer@desa.com',
            'password' => Hash::make('viewer123')
        ]);
        $viewer->assignRole('viewer');
    }
}