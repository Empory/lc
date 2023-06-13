<?php

namespace App\Http\Controllers;

use App\Post;
use App\User;
use Illuminate\Support\Facades\DB;

class DenemeController extends Controller
{
    public function sonkoseyazilari()
    {



        $latestPosts = Post::select('user_id', DB::raw('MAX(id) as post_id'))
            ->where('type','opinion')
            ->where('approve', 'yes')
            ->whereNull('deleted_at')
            ->orderByDesc('published_at')
            ->groupBy('user_id');

        /*echo '<pre>';
        print_r($latestPosts);
        echo '</pre>';*/

        $opinionColumnists = User::joinSub($latestPosts, 'latest_posts', function ($join) {
                $join->on('users.id', '=', 'latest_posts.user_id');
            })->join('posts', 'posts.id', '=', 'latest_posts.post_id')
            ->where('usertype','Staff')
            ->orderByDesc('latest_posts.post_id')
            ->select('latest_posts.*', 'posts.title', 'posts.slug', 'icon', 'name')
            ->take(4)
            ->get();


        echo '<pre>';
        print_r($opinionColumnists);
        echo '</pre>';

        return 1;


    }
}
