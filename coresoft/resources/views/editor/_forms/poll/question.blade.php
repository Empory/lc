<?php
$lfld= isset($entry->id) ? $entry->id : '';
$uniquid = time().$lfld ;
?>
<div class="entry" data-type="poll" data-co="{{ $uniquid }}" @if(isset($entry->id)) data-entry-id="{{ $entry->id }}"
    @endif>
    @include('editor._forms.__entryactions')
    <h3><i class="fa fa-check-circle-o"></i> {{ trans('addpost.option') }}</h3>
    <div class="inpunting  ordering">
        <button class="order-number button button-gray">1</button>
        {!! Form::text(null, isset($entry->title) ? $entry->title : null, ['data-type' => 'title', 'class' => 'cd-input
        ', 'placeholder' => trans('addpost.option')]) !!}
    </div>
    <div class="inpunting mediaupload {{isset($entry->image) ? 'hidden' : ''}}">
        <div class="item-media-placeholder">
            <i class="fa fa-picture-o  fa-2x"></i><br>
            <small class="text-muted">{{ trans('addpost.entry_addimage') }}</small>
            <form action="">
                <input type="file" accept="image/*" class="uploadaimage" data-target="entry">
            </form>
            <div class="detail-or"> {{ trans('updates.or') }} </div>
            <div class="image-upload-actions">
                <a class="button button-white getimageurl" data-action="add" data-target="entry">{{  trans('updates.getfromurl') }} <i class="fa fa-download"></i></a>
            </div>
        </div>
    </div>
    {!! Form::hidden(null, isset($entry->image) ? makepreview($entry->image, null, 'entries') : null, ['data-type' =>
    'image', 'class' => 'cd-input cd-input-image ']) !!}
    <div class="inpunting imagearea @if(empty($entry->image)) hide @endif">
        <div class="imagearea_img">
            @if(isset($entry->image)) <img src="{{ makepreview($entry->image, null, 'entries') }}"> @endif
        </div>
        <div class="thumbactions">
            <a class="button button-red deleteimage" data-action="remove" data-target="image"><i
                    class="fa fa-trash"></i></a> <a class="button button-white makepreview"><i
                    class="fa fa-image"></i>&nbsp;{{ trans('addpost.makepreview') }}</a>
        </div>
    </div>
    <div class="moredetail text">

        <div class="detailhide hidden">

            <div class="inpunting">
                {!! Form::text(null, isset($entry->source) ? $entry->source : null, ['data-type' => 'source', 'class' =>
                'cd-input ', 'placeholder' => trans('addpost.entry_source')]) !!}
            </div>
            <div class="inpunting">
                {!! Form::textarea(null, isset($entry->body) ? $entry->body : null, ['data-type' => 'body', 'class' =>
                'message','id' => 'edit'.uniqid(), 'placeholder' => trans('addpost.entry_body')]) !!}
            </div>
        </div>
        <a href="javascript:;" class="trigger float-right">
        <span class="down">{{ trans('addpost.mored') }} <i class="fa fa-angle-down"></i></span>
        <span class="up">{{ trans('addpost.lessd') }} <i class="fa fa-angle-up"></i></span>
        </a>
    </div>
    <div class="moredetail questionmore">

        <div class="answertypeselection">
            <a class="button @if(isset($entry->video)) {{ $entry->video=='3' ?  'button-orange' : 'button-white'}} @else button-orange @endif clickanswertype" data-style="thlist" data-query="3" @if(isset($entry->video)) {{ $entry->video=='3' ? 'data-curtype=on' : '' }}@else data-curtype="on" @endif><i class="fa fa-th-list "></i></a>
            <a class="button @if(isset($entry->video)) {{ $entry->video=='1' ?  'button-orange' : 'button-white'}} @else button-white @endif clickanswertype" data-style="thdefault" data-query="1" @if(isset($entry->video)) {{ $entry->video=='1' ? 'data-curtype=on' : '' }} @endif><i class="fa fa-th"></i></a>
            <a class="button @if(isset($entry->video)) {{ $entry->video=='2' ?  'button-orange' : 'button-white'}} @else button-white @endif clickanswertype" data-style="thlarge" data-query="2" @if(isset($entry->video)) {{ $entry->video=='2' ? 'data-curtype=on' : '' }} @endif><i class="fa fa-th-large"></i></a>
        </div>
        <div class="clearfix"></div>

        <div id="answer{{ $uniquid }}" class="answers clearfix @if(isset($entry->video)) @if($entry->video == '1')thdefault @else {{  $entry->video == "2" ? 'thlarge' : 'thlist' }}@endif @else thlist @endif">
            @if(!isset($entry))

            @include('editor._forms.poll.answer')

            @include('editor._forms.poll.answer')

            @include('editor._forms.poll.answer')

            @else

            @foreach($post->entries()->where('type', 'answer')->where('source', (int)$entry->id)->orderBy('order')->get() as $answeras)
            @if(isset($answeras))
            @include('editor._forms.poll.answer', ['answer' => $answeras])
            @endif
            @endforeach
            @endif
        </div>
        <div class="clearfix"></div>
        <a class="button button-white button-full submit-button entry_fetch answerbutton clearfix" data-method="Get" data-target="answer{{ $uniquid }}" data-puttype="append" data-type="pollanswerform" href="{{ route('post.new-entry-form') }}?addnew=pollanswer">
        <i class="fa fa-plus-circle"></i>{{trans('addpost.add', ['type' => trans('buzzyquiz.answer')]) }}
        </a>
    </div>
</div>
