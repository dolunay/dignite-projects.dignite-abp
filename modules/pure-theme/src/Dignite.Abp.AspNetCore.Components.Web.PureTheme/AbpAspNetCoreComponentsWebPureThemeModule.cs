﻿using Dignite.Abp.BlazoriseUI;
using Volo.Abp.AspNetCore.Components.Web.Theming;
using Volo.Abp.Modularity;

namespace Dignite.Abp.AspNetCore.Components.Web.PureTheme;

[DependsOn(
    typeof(AbpAspNetCoreComponentsWebThemingModule),
    typeof(DigniteAbpBlazoriseUiModule)
    )]
public class AbpAspNetCoreComponentsWebPureThemeModule : AbpModule
{
}