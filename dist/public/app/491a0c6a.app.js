"use strict";angular.module("nightlifeApp",["ngCookies","ngResource","ngSanitize","ngRoute","ui.bootstrap"]).config(["$routeProvider","$locationProvider","$httpProvider",function(a,b,c){a.otherwise({redirectTo:"/"}),b.html5Mode(!0),c.interceptors.push("authInterceptor")}]).factory("authInterceptor",["$rootScope","$q","$cookieStore","$window",function(a,b,c,d){return{request:function(a){return a.headers=a.headers||{},c.get("jwtToken")&&(a.headers.Authorization="Bearer "+c.get("jwtToken")),a},responseError:function(a){return 401===a.status?(c.remove("token"),c.remove("jwtToken"),d.location.href="/auth/twitter",b.reject(a)):b.reject(a)}}}]).service("errorService",["$rootScope",function(a){var b={};return{setError:function(c,d){b[c]=d,a.$broadcast("errors:updated",b)},removeError:function(c){delete b[c],a.$broadcast("errors:updated",b)},getError:function(a){return b[a]||""},getAllErrors:function(){return b}}}]).service("resultsService",["$cookies","$http","$location","$rootScope","Auth",function(a,b,c,d,e){var f=this,g={};return this.results={},g.getResults=function(){return f.results},g.setResults=function(a){f.results=a,d.$broadcast("results:updated",a)},g.fetchResults=function(e){""===e&&(e="Waco, TX"),c.search("location",e);var g=encodeURIComponent(e);return a.put("next",c.url()),b.get("/api/locations/"+g).then(function(a){return f.results=a.data,d.$broadcast("results:updated",f.results),a.data})},g.rsvpStatus=function(a){console.log(e.getCurrentUser().username);var b=_.find(a.visitorData.visitors,function(a){return a.username===e.getCurrentUser().username});return b?!0:!1},g.toggleVisitor=function(a){var c=a.id,d=g.rsvpStatus(a);return b.patch("/api/businesses/"+c,{op:d?"removeVisitor":"addVisitor",path:"/api/businesses/"+a.id}).then(function(b){if(c!==a.id)throw Error("Business changed during the request!");return a.visitorData=b.data,b.data})},g}]),angular.module("nightlifeApp").config(["$routeProvider",function(a){a.when("/login",{templateUrl:"app/account/login/login.html",controller:"LoginCtrl"}).when("/signup",{templateUrl:"app/account/signup/signup.html",controller:"SignupCtrl"}).when("/settings",{templateUrl:"app/account/settings/settings.html",controller:"SettingsCtrl",authenticate:!0})}]),angular.module("nightlifeApp").controller("LoginCtrl",["$scope","Auth","$location",function(a,b,c){a.user={},a.errors={},a.login=function(d){a.submitted=!0,d.$valid&&b.login({email:a.user.email,password:a.user.password}).then(function(){c.path("/")})["catch"](function(b){a.errors.other=b.message})}}]),angular.module("nightlifeApp").controller("SettingsCtrl",["$scope","User","Auth",function(a,b,c){a.errors={},a.changePassword=function(b){a.submitted=!0,b.$valid&&c.changePassword(a.user.oldPassword,a.user.newPassword).then(function(){a.message="Password successfully changed."})["catch"](function(){b.password.$setValidity("mongoose",!1),a.errors.other="Incorrect password",a.message=""})}}]),angular.module("nightlifeApp").controller("SignupCtrl",["$scope","Auth","$location",function(a,b,c){a.user={},a.errors={},a.register=function(d){a.submitted=!0,d.$valid&&b.createUser({name:a.user.name,email:a.user.email,password:a.user.password}).then(function(){c.path("/")})["catch"](function(b){b=b.data,a.errors={},angular.forEach(b.errors,function(b,c){d[c].$setValidity("mongoose",!1),a.errors[c]=b.message})})}}]),angular.module("nightlifeApp").controller("AdminCtrl",["$scope","$http","Auth","User",function(a,b,c,d){a.users=d.query(),a["delete"]=function(b){d.remove({id:b._id}),angular.forEach(a.users,function(c,d){c===b&&a.users.splice(d,1)})}}]),angular.module("nightlifeApp").config(["$routeProvider",function(a){a.when("/admin",{templateUrl:"app/admin/admin.html",controller:"AdminCtrl"})}]),angular.module("nightlifeApp").factory("Auth",["$location","$rootScope","$http","User","$q","$cookies",function(a,b,c,d,e,f){var g={};return f.get("jwtToken")&&(g=d.get()),{login:function(a,b){var h=b||angular.noop,i=e.defer();return c.post("/auth/local",{email:a.email,password:a.password}).success(function(a){return f.put("token",a.token),g=d.get(),i.resolve(a),h()}).error(function(a){return this.logout(),i.reject(a),h(a)}.bind(this)),i.promise},logout:function(){f.remove("token"),g={}},createUser:function(a,b){var c=b||angular.noop;return d.save(a,function(b){return f.put("token",b.token),g=d.get(),c(a)},function(a){return this.logout(),c(a)}.bind(this)).$promise},changePassword:function(a,b,c){var e=c||angular.noop;return d.changePassword({id:g._id},{oldPassword:a,newPassword:b},function(a){return e(a)},function(a){return e(a)}).$promise},getCurrentUser:function(){return g},isLoggedIn:function(){return g.hasOwnProperty("role")},isLoggedInAsync:function(a){g.hasOwnProperty("$promise")?g.$promise.then(function(){a(!0)})["catch"](function(){a(!1)}):a(g.hasOwnProperty("role")?!0:!1)},isAdmin:function(){return"admin"===g.role},getToken:function(){return f.get("token")}}}]),angular.module("nightlifeApp").factory("User",["$resource",function(a){return a("/api/users/:id/:controller",{id:"@_id"},{changePassword:{method:"PUT",params:{controller:"password"}},get:{method:"GET",params:{id:"me"}}})}]),angular.module("nightlifeApp").controller("MainCtrl",["$scope","errorService",function(a,b){a.errors=b.getAllErrors(),a.$on("errors:updated",function(b){a.errors=b})}]),angular.module("nightlifeApp").config(["$routeProvider",function(a){a.when("/",{templateUrl:"app/main/main.html",controller:"MainCtrl"})}]),angular.module("nightlifeApp").controller("ResultsController",["$scope","$document","$http","$location","Auth","resultsService","errorService",function(a,b,c,d,e,f,g){a.results=f.getResults(),a.$on("results:updated",function(){a.results=f.getResults()}),a.rsvpStatus=function(b){var c=a.results.businesses[b];return f.rsvpStatus(c)},a.getText=function(b){return a.rsvpStatus(b)?"Back Out.":"I'm going!"},a.getTextSmall=function(b){return a.rsvpStatus(b)?"Nope.":"Going!"},a.toggleVisitor=function(b){var c=a.results.businesses[b];return f.toggleVisitor(c)["catch"](function(){g.setError("reservationError","There was a problem changing your reservation status. Please try again.")})}}]).directive("resultsView",["$window",function(a){return{templateUrl:"app/resultsView/resultsView.html",restrict:"EA",controller:"ResultsController",link:function(a,b,c){}}}]),angular.module("nightlifeApp").controller("SearchController",["$scope","$cookies","$http","$location","resultsService","errorService",function(a,b,c,d,e,f){a.init=function(){a.error=f.getError("searchError"),a.$on("errors:updated",function(){a.error=f.getError("searchError")}),a.searchBar={searchTerm:d.search().location||""},""!==a.searchBar.searchTerm&&a.submitSearch()},a.submitSearch=function(){return e.fetchResults(a.searchBar.searchTerm)["catch"](function(a){404===a.status?f.setError("searchError","That location was not found."):f.setError("searchError","There was an error searching for that location.")})},a.init()}]).directive("searchBar",function(){return{templateUrl:"app/searchBar/searchBar.html",restrict:"EA",controller:"SearchController",link:function(a,b,c){}}}),angular.module("nightlifeApp").run(["$templateCache",function(a){a.put("app/account/login/login.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Login</h1><p>Accounts are reset on server restart from <code>server/config/seed.js</code>. Default account is <code>test@test.com</code> / <code>test</code></p><p>Admin account is <code>admin@admin.com</code> / <code>admin</code></p></div><div class=col-sm-12><form class=form name=form ng-submit=login(form) novalidate><div class=form-group><label>Email</label><input type=email name=email class=form-control ng-model=user.email required></div><div class=form-group><label>Password</label><input type=password name=password class=form-control ng-model=user.password required></div><div class="form-group has-error"><p class=help-block ng-show="form.email.$error.required && form.password.$error.required && submitted">Please enter your email and password.</p><p class=help-block ng-show="form.email.$error.email && submitted">Please enter a valid email.</p><p class=help-block>{{ errors.other }}</p></div><div><button class="btn btn-inverse btn-lg btn-login" type=submit>Login</button> <a class="btn btn-default btn-lg btn-register" href=/signup>Register</a></div></form></div></div><hr></div>'),a.put("app/account/settings/settings.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Change Password</h1></div><div class=col-sm-12><form class=form name=form ng-submit=changePassword(form) novalidate><div class=form-group><label>Current Password</label><input type=password name=password class=form-control ng-model=user.oldPassword mongoose-error><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.other }}</p></div><div class=form-group><label>New Password</label><input type=password name=newPassword class=form-control ng-model=user.newPassword ng-minlength=3 required><p class=help-block ng-show="(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || submitted)">Password must be at least 3 characters.</p></div><p class=help-block>{{ message }}</p><button class="btn btn-lg btn-primary" type=submit>Save changes</button></form></div></div></div>'),a.put("app/account/signup/signup.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Sign up</h1></div><div class=col-sm-12><form class=form name=form ng-submit=register(form) novalidate><div class=form-group ng-class="{ \'has-success\': form.name.$valid && submitted,\n                                            \'has-error\': form.name.$invalid && submitted }"><label>Name</label><input name=name class=form-control ng-model=user.name required><p class=help-block ng-show="form.name.$error.required && submitted">A name is required</p></div><div class=form-group ng-class="{ \'has-success\': form.email.$valid && submitted,\n                                            \'has-error\': form.email.$invalid && submitted }"><label>Email</label><input type=email name=email class=form-control ng-model=user.email required mongoose-error><p class=help-block ng-show="form.email.$error.email && submitted">Doesn\'t look like a valid email.</p><p class=help-block ng-show="form.email.$error.required && submitted">What\'s your email address?</p><p class=help-block ng-show=form.email.$error.mongoose>{{ errors.email }}</p></div><div class=form-group ng-class="{ \'has-success\': form.password.$valid && submitted,\n                                            \'has-error\': form.password.$invalid && submitted }"><label>Password</label><input type=password name=password class=form-control ng-model=user.password ng-minlength=3 required mongoose-error><p class=help-block ng-show="(form.password.$error.minlength || form.password.$error.required) && submitted">Password must be at least 3 characters.</p><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.password }}</p></div><div><button class="btn btn-inverse btn-lg btn-login" type=submit>Sign up</button> <a class="btn btn-default btn-lg btn-register" href=/login>Login</a></div></form></div></div><hr></div>'),a.put("app/admin/admin.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p><ul class=list-group><li class=list-group-item ng-repeat="user in users"><strong>{{user.name}}</strong><br><span class=text-muted>{{user.email}}</span> <a ng-click=delete(user) class=trash><span class="glyphicon glyphicon-trash pull-right"></span></a></li></ul></div>'),a.put("app/main/main.html",'<div class=container style="max-width: 1175px"><!-- TODO Add error messages in main scope --><search-bar></search-bar><span></span><results-view></results-view></div><footer class=footer><div class=container><p>Built with Angular Fullstack v2.1.1 | <a href=https://twitter.com/cooley_vince>@cooley_vince</a> | <a href="https://github.com/vcooley/fcc-nightlife-app/issues?state=open">Issues</a> | <a href=https://yelp.com><img height=25px width=112px src=https://s3-media2.fl.yelpcdn.com/assets/srv0/developer_pages/9bfe343c35cc/assets/img/yelp_powered_btn_light@2x.png></a></p></div></footer>'),a.put("app/resultsView/resultsView.html",'<!--Business list --><div id=item-list style="max-width: 95%"><ul><li ng-repeat="business in results.businesses" id=business-container class="container-fluid business well"><div class="col-xs-3 col-sm-2"><div class=icon><img class="img-responsive img-thumbnail center-block" src="{{ business.image_url || \'http://s3-media4.fl.yelpcdn.com/assets/srv0/yelp_styleguide/c7a42ec68c3c/assets/img/default_avatars/business_180_square.png\'}}"></div><button class="btn going-btn" ng-class="{\'btn-success\': !rsvpStatus($index), \'btn-danger\': rsvpStatus($index)}" ng-click=toggleVisitor($index)>{{ getText($index) }}</button> <button class="btn going-btn-sm" ng-class="{\'btn-success\': !rsvpStatus($index), \'btn-danger\': rsvpStatus($index)}" ng-click=toggleVisitor($index)>{{ getTextSmall($index) }}</button></div><div id=business-info class=col-xs-9><a href="{{ business.url }}"><h2>{{ business.name }}</h2></a><!-- Visitors list templates --><!-- Show if there are some visitors --> <span ng-show="business.visitorData.visitors.length > 0"><span ng-repeat="visitor in business.visitorData.visitors | limitTo: 3" class=visitor><a href="https://twitter.com/{{ visitor.username }}">@{{ visitor.username }}</a></span></span><!--Also show if more than 3 visitors--> <span ng-show="business.visitorData.visitors.length > 3"><span>...and <a>{{business.visitorData.visitors.length - 3}} others</a></span></span> <span ng-show="business.visitorData.visitors.length > 1">are going.</span> <span ng-show="business.visitorData.visitors.length === 1">is going.</span><!-- No Visitors --> <span ng-show="business.visitorData.visitors.length === 0">No one has RSVP\'d yet. You can start the trend!</span><div class=detail><span id=snippet>{{ business.snippet_text }}</span><br></div></div></li></ul></div>'),a.put("app/searchBar/searchBar.html",'<div class="container-fluid center-block"><form ng-submit=submitSearch() class="input-group center-block"><div id=search-bar class="form-group input-group-lg"><input class=form-control ng-model=searchBar.searchTerm placeholder="Where are you?"></div><div class="form-group pull-left"><button id=search-button class="btn btn-lg btn-success">Search</button></div></form></div>')}]);