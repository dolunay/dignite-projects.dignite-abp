// import { Environment } from '@abp/ng.core';

// const baseUrl = 'http://localhost:4200';

// export const environment = {
//   production: false,
//   hmr: false,
//   application: {
//     baseUrl,
//     name: 'MyProjectName',
//     logoUrl: '',
//   },
//   oAuthConfig: {
//     issuer: 'https://localhost:44305/',
//     clientId: 'MyProjectName_App',
//     scope: 'offline_access MyProjectName',
//     responseType: 'code',
//     redirectUri: baseUrl,
//   },
//   apis: {
//     default: {
//       url: 'https://localhost:44305',
//       rootNamespace: 'MyCompanyName.MyProjectName',
//     },
//     AbpAccount: {
//       rootNamespace: 'Volo.Abp',
//     },
//     AbpFeatureManagement: {
//       rootNamespace: 'Volo.Abp',
//     },
//     AbpPermissionManagement: {
//       rootNamespace: 'Volo.Abp.PermissionManagement',
//     },
//     AbpTenantManagement: {
//       rootNamespace: 'Volo.Abp.TenantManagement',
//     },
//     AbpIdentity: {
//       rootNamespace: 'Volo.Abp',
//     },
//     SettingManagement: {
//       rootNamespace: 'Volo.Abp.SettingManagement',
//     },
//   },
// } as Environment;


import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

export const environment = {
  production: false,
  application: {
    baseUrl: 'http://localhost:4200/',
    name: 'Cms',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44361/',
    redirectUri: baseUrl,
    clientId: 'Auth_App',
    responseType: 'code',
    scope: 'offline_access Auth',
    requireHttps: true
  },
  apis: {
    default: {
      url: 'https://localhost:44356',
      rootNamespace: 'Dignite.Cms',
    },
    AbpAccountPublic: {
      url: 'https://localhost:44361',
      rootNamespace: 'AbpAccountPublic',
    },
  },
} as Environment;
