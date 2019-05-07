<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();


Route::get("/test", function(){
    return \Auth::user();
});

Route::get("/test2", function(){
    return \Auth::user();
});

Route::get("/auth", function(){
    return \Auth::user();
});

Route::group(['prefix' => 'blogs'], function() {
    Route::post("/{id}/comment", 'BlogController@comment');
    Route::get("/", 'BlogController@index');
    Route::get("/{id}", 'BlogController@show');

    Route::group(['middleware' => ['auth']], function() {
        Route::post("/", 'BlogController@store');
        Route::post("/{id}", 'BlogController@update');
        Route::delete("/{id}", 'BlogController@destroy');
    });
});



Route::get('/{path?}', function(Request $request){
    return view('app_react');
})->where('path','.*');