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

// Route::get('/', function () {
//     return view('welcome');
// });

Auth::routes();

// Route::get('/home', 'HomeController@index')->name('home');

Route::post("/blogs/{id}/comment", 'BlogController@comment');
Route::get("/blogs", 'BlogController@index');
Route::get("/blogs/{id}", 'BlogController@show');

Route::get("/auth", function(){
    return \Auth::user();
});

Route::group(['middleware' => ['auth']], function() {
    Route::post("/blogs", 'BlogController@store');
    Route::post("/blogs/{id}", 'BlogController@update');
    Route::delete("/blogs/{id}", 'BlogController@destroy');
});


Route::get('/{path?}', function(Request $request){
    return view('app_react');
})->where('path','.*');