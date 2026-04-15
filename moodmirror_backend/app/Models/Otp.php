<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model; 

class Otp extends Model
{
    use HasFactory;
    protected $connection = 'mongodb';
    protected $collection = 'otps';

    protected $fillable = ['email', 'otp', 'expires_at'];
    protected $dates = ['expires_at'];
}

