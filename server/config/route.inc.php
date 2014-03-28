<?php 
// base/path/youRequest => Controller@Method
// Example: wwww.url.com/home => Home@getPage
return array(
	'auth/login' => 'LoginCtrl@login',
	'auth/register' => 'RegisterCtrl@register',
	'menu/get' => 'MenuCtrl@getMenu',
	
	// A default route is always nice! if something goes wrong
	// example defaultRoute => ErrorCtrl@invalidRequest
	'defaultRoute' => 'LoginCtrl@login'
);