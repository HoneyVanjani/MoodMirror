<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model; 

class Mood extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'moods';

    protected $fillable = [
        'user_id',
        'mood', //happy,sad
        'date',
    ];
    protected $casts = [
    'user_id' => 'string',
    'date' => 'datetime',
    ];

}
