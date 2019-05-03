<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */
use App\Blog;
use Illuminate\Support\Str;
use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(Blog::class, function (Faker $faker) {
    return [
        'user_id' => function () {
            return factory(App\User::class)->create()->id;
        },
        'title' => $faker->name,
        'body' => '<h1>'.$faker->name.'</h1><p>'.$faker->text(800).'</p><ol><li>'.$faker->name.'</li><li>'.$faker->name.'</li><li>'.$faker->name.'</li><li>'.$faker->name.'</li><li>'.$faker->name.'</li><li>'.$faker->name.'</li></ol>'.$faker->text(800),
    ];
});
