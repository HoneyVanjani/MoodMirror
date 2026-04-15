<?php

namespace App\Models;

// Use the MongoDB Eloquent Model base class
use MongoDB\Laravel\Eloquent\Model as Eloquent;
use Laravel\Sanctum\Contracts\HasAbilities;
use Illuminate\Support\Str; // Needed for strpos

class PersonalAccessToken extends Eloquent implements HasAbilities
{
    protected $connection = 'mongodb';
    protected $collection = 'personal_access_tokens';

    protected $fillable = [
        'tokenable_type',
        'tokenable_id',
        'name',
        'token',
        'abilities',
        'last_used_at',
    ];

    protected $casts = [
        'abilities' => 'array',
        'last_used_at' => 'datetime',
    ];
    
    /**
     * The primary key is usually '_id' for MongoDB. 
     * We explicitly set it here for clarity, though it's often default.
     * Sanctum's findToken logic relies on this to be correct.
     */
    protected $primaryKey = '_id'; 

    public function tokenable()
    {
        return $this->morphTo();
    }
    
    // --- The missing findToken() method ---
    
    /**
     * Find the token instance that matches the given token.
     *
     * @param  string  $token
     * @return static|null
     */
    public static function findToken($token)
    {
        if (strpos($token, '|') === false) {
            // Token is a raw token string (not prefixed with ID)
            return static::where('token', hash('sha256', $token))->first();
        }

        [$id, $token] = explode('|', $token, 2);

        // For MongoDB, the ID is typically '_id'
        if ($instance = static::where('_id', $id)->first()) {
            return hash_equals($instance->token, hash('sha256', $token))
                        ? $instance
                        : null;
        }
    }
    
    // --- HasAbilities Contract Implementation ---

    public function can($ability)
    {
        return in_array('*', $this->abilities) ||
               in_array($ability, $this->abilities);
    }

    public function cant($ability)
    {
        return !$this->can($ability);
    }
}