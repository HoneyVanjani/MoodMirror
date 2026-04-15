<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Feedback extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'feedbacks';

    protected $fillable = [
        'user_id',
        'description',
        'rating',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }
}
