<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model; 

class Journal extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'journals'; 

    protected $fillable = [
        'user_id',
        'title',      
        'content',    
        'mood',       
        'date'        
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}