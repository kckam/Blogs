<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stevebauman\Purify\Facades\Purify;
use \App\Blog;
use \App\Comment;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $blogs = Blog::withCount('comments');

        if($request->sort_recent == "true") {
            $blogs = $blogs->orderBy('created_at', 'DESC');
        }

        if($request->sort_popular == "true") {
            $blogs = $blogs->orderBy('comments_count','desc');
        }

        if(!empty($request->s)) {
            $blogs = $blogs->where('title', 'like', '%' . $request->s . '%');
        }

        $blogs = $blogs->paginate(15);

        $blogs->map(function($el){
            $el->created_at_readable = $el->created_at->diffForHumans();
            $el->comment_count = count($el->comments);

            return $el;
        });

        return \Response::json([
            'data' => $blogs
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required', //no duplicate permission name, except from user permission
            'body' => 'required'
        ]);
       
        try {
            if(\Auth::user()->role === "admin") {
                $blog = new Blog;
                $blog->user_id = \Auth::id();
                $blog->title = Purify::clean($request->title);
                $blog->body = Purify::clean($request->body);
                $blog->save();
    
                return \Response::json([
                    'data' => $blog
                ], 200);
            }
            else {
                throw new Exception(); 
            }
        }
        catch (\Exception $e) {
            return \Response::json([
                'message' => 'Error',
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $blog = Blog::with('comments')->find($id);

        $blog->created_at_readable = $blog->created_at->diffForHumans();

        $blog->comments->map(function($el){
            $el->created_at_readable = $el->created_at->diffForHumans();
            $el->comment_count = count($el->comments);

            return $el;
        });

        return \Response::json([
            'data' => $blog
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required', //no duplicate permission name, except from user permission
            'body' => 'required'
        ]);
       
        try {
            $blog = Blog::find($id);
            $blog->title = $request->title;
            $blog->body = $request->body;
            $blog->save();

            return \Response::json([
                'data' => $blog
            ], 200);
        }
        catch (\Exception $e) {
            return \Response::json([
                'message' => 'Error',
            ], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        try {
            if(\Auth::user()->role === "admin") {
                $blog = Blog::find($id);
                $blog->delete();
        
                return \Response::json([
                    'data' => $blog
                ], 200);
            }
            else {
                throw new \Exception(); 
            }
        }
        catch (\Exception $e) {
            return \Response::json([
                'message' => 'Error',
            ], 400);
        }
    }

    /**
     * Post comment
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function comment($id, Request $request)
    {
        $request->validate([
            'name' => 'required', //no duplicate permission name, except from user permission
            'comment' => 'required'
        ]);
        
       
        try {
            $comment = new Comment;
            $comment->blog_id = $id;
            $comment->name = Purify::clean($request->name);
            $comment->comment = Purify::clean($request->comment);
            $comment->save();

            return \Response::json([
                'data' => $this->show($id)->getData()->data
            ], 200);
        }
        catch (\Exception $e) {
            return \Response::json([
                'message' => 'Error',
            ], 400);
        }
    }
}
