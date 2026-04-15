<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Activity extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'activities';
    protected $fillable = [
        'user_id', 'type', 'description', 'timestamp'
    ];
}
