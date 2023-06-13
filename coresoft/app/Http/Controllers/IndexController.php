<?php

namespace App\Http\Controllers;

use App\Post;
use App\User;
use Illuminate\Support\Facades\DB;

class IndexController extends Controller
{
    public function __invoke()
    {
        if (Post::count() < 1) {
            return view('errors.starting');
        }

        $lastFeaturestop = [];
        $HomeColSec1Tit1 = null;
        $HomeColSec2Tit1 = null;
        $HomeColSec3Tit1 = null;
        $CurrentTheme = get_buzzy_theme();
        $HomeColSec1Type1 = config('buzzytheme_' . $CurrentTheme . '.HomeColSec1Type1', ["list", "quiz"]);
        $HomeColSec2Type1 = config('buzzytheme_' . $CurrentTheme . '.HomeColSec2Type1', ["news"]);
        $HomeColSec3Type1 = config('buzzytheme_' . $CurrentTheme . '.HomeColSec3Type1', ["video"]);

        if (get_buzzy_config('p_homepagebuilder') == "on" && (!get_multilanguage_enabled() || get_multilanguage_enabled() && get_default_language() === get_buzzy_Locale())) {
            $HomeColSec1Tit1 = get_buzzy_config('HomeColSec1Tit1');
            $HomeColSec2Tit1 = get_buzzy_config('HomeColSec2Tit1');
            $HomeColSec3Tit1 = get_buzzy_config('HomeColSec3Tit1');
            $HomeColSec1Type1 = get_buzzy_config('HomeColSec1Type1', $HomeColSec1Type1);
            $HomeColSec2Type1 = get_buzzy_config('HomeColSec2Type1', $HomeColSec2Type1);
            $HomeColSec3Type1 = get_buzzy_config('HomeColSec3Type1', $HomeColSec3Type1);
        }

        // Colums 1
        $lastFeatures = Post::forHome()->byAcceptedTypes($HomeColSec1Type1)->notInOpinion()->byPublished()->byLanguage()->byApproved()->paginate(10);

        // Colums 1 - Latest Videos
        $lastVideos  = Post::forHome()->byType('video')->notInOpinion()->byPublished()->byLanguage()->byApproved()->getStats('one_day_stats', 'DESC')->paginate(1);

        $homeVideos  = Post::forHome()->byType('video')->byPublished()->byLanguage()->byApproved()->where('show_in_home_videos', 1)->orderByDesc('published_at')->take(10)->get();

        // Colums 1 - Latest Polls
        $lastPolls = Post::forHome()->byType('poll')->notInOpinion()->byPublished()->byLanguage()->byApproved()->paginate(2);

        // Colums 2
        $lastNews = Post::forHome()->byAcceptedTypes($HomeColSec2Type1)->notInOpinion()->byPublished()->byLanguage()->byApproved()->paginate(config('buzzytheme_' . $CurrentTheme . '.homepage_news_limit', 10));

        if (request()->query('page')) {
            if (!request()->ajax()) {
                return redirect()->route('home');
            }

            if (request()->query("timeline") == "right") {
                return view('pages.indexrightpostloadpage', compact('lastNews'));
            } else {
                return view('pages.indexpostloadpage', compact('lastFeatures', 'lastVideos', 'lastPolls'));
            }
        }

        // Featured Posts
        if (get_buzzy_theme_config('SiteHeadlineStyle') != 'off') {
            /*$lastFeaturestop = Post::with('user')->forHome('Features')->notInOpinion()->byPublished()->byLanguage()->byApproved()->byFeatured()->take(get_headline_posts_count())->get();*/
            $lastFeaturestop = Post::notInOpinion()->where('show_in_breaking_news', 1)->byPublished()->byLanguage()->byApproved()->orderByDesc('published_at')->take(3)->get();
        }

        $mainSlides = Post::with('user')->where('show_in_main_slide', 1)->notInOpinion()->byPublished()->byLanguage()->byApproved()->orderByDesc('published_at')->take(10)->get();
        $mainSlides2 = Post::with('user')->where('show_in_main_slide_2', 1)->notInOpinion()->byPublished()->byLanguage()->byApproved()->orderByDesc('published_at')->take(15)->get();

        // Colums 3
        $lastTrendingVideos = Post::forHome()->byAcceptedTypes($HomeColSec3Type1)->notInOpinion()->byPublished()->byLanguage()->byApproved()->take(10)->get();

        // Trending Posts
        $lastTrending = Post::forHome()->getStats('one_day_stats', 'DESC', 10)->notInOpinion()->byPublished()->byLanguage()->byApproved()->getCached('home_trending', now()->addMinutes(5));

        $oneCikanlar = Post::forHome()->getStats('seven_days_stats', 'DESC', 12)->notInOpinion()->byPublished()->byLanguage()->byApproved()->getCached('home_one_cikanlar', now()->addMinutes(5));

        // anasayfa yazarlar kose yazilari
        /*$koseYazilari = Post::with('user')->Opinion()->byPublished()->byLanguage()->byApproved()->orderByDesc('published_at')->take(4)->get();*/


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



        return view(
            'pages.index',
            compact(
                'mainSlides',
                'mainSlides2',
                'lastFeaturestop',
                'lastFeatures',
                'lastVideos',
                'homeVideos',
                'lastPolls',
                'lastNews',
                'lastTrending',
                'oneCikanlar',
                /*'koseYazilari',*/
                'opinionColumnists',
                'lastTrendingVideos',
                'HomeColSec1Tit1',
                'HomeColSec2Tit1',
                'HomeColSec3Tit1'
            )
        );
    }
}
