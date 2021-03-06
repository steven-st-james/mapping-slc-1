'use strict';

//Setting up route
angular.module('admins').config(['$stateProvider',
  function ($stateProvider) {
    // Projects state routing
    $stateProvider.state('admin', {
      abstract: true,
      url: '/admin',
      template: '<ui-view>',
    //data property is inherited by child states, so you can place something like this authenticate flag in the parent.
      data: {
        authenticate: true,
        roles: ['admin']
      },
      authPermissions: {
        roles: ['admin', 'superUser']
      }
    })
    //admin projects routes
    .state('admin.dashboard', {
      url: '/dashboard',
      templateUrl: 'modules/admins/client/views/admins.client.view.html',
      data: {
        pageTitle: 'Admin Dashboard',
        roles: ['admin', 'superUser']
      }
    })
    .state('admin.adminProjectsQueue', {
      url: '/projects-queue',
      templateUrl: 'modules/admins/client/views/projects/admin-projects-list.client.view.html',
      data: {
        pageTitle: 'Admin | List All Projects'
      }
    })
    .state('admin.adminEditProject', {
      url: '/edit-project/:projectId',
      templateUrl: 'modules/admins/client/views/projects/admin-view-project.client.view.html',
      // controller: 'AuthenticationController',
      controllerAs: 'vm',
      data: {
        pageTitle: 'Admin | Edit Project'
      }
    })

    //admin contact form routes
    .state('admin.adminListMessages', {
      url: '/messages',
      templateUrl: 'modules/admins/client/views/messages/admin-list-messages.client.view.html',
      data: {
        pageTitle: 'Admin | Contact Form'
      }
    })
    .state('admin.adminViewMessage', {
      url: '/messages/:contactId',
      templateUrl: 'modules/admins/client/views/messages/admin-view-message.client.view.html',
      data: {
        pageTitle: 'Admin | View Messages'
      }
    })

    //admin user routes
    .state('admin.adminListUsers', {
      url: '/list-users',
      templateUrl: 'modules/admins/client/views/users/admin-list-users.client.view.html',
      data: {
        pageTitle: 'Admin | List Users'
      }
    })
    .state('admin.adminViewUser', {
      url: '/users/:userId',
      templateUrl: 'modules/admins/client/views/users/admin-view-user.client.view.html',
      data: {
        pageTitle: 'Admin | View User'
      }
    }).state('adminEditUser', {
      url: '/users/:userId/edit',
      templateUrl: 'modules/admins/client/views/users/admin-edit-user.client.view.html',
      data: {
        pageTitle: 'Admin | Edit User'
      }
    })
    .state('admin.createUser', {
      url: '/create-user',
      templateUrl: 'modules/users/client/views/create-user.client.view.html',
      data: {
        pageTitle: 'Admin | Add User'
      }
    });
  }

]);
