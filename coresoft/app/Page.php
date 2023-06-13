<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = ['title', 'description', 'text', 'slug', 'footer', 'full_page', 'aktif_mi'];
}
