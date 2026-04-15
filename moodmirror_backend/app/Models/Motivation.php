<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Motivation extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'motivations';

    protected $fillable = [
        'mood',
        'quote',
        'resource'
    ];
}
