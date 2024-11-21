﻿using System.IO;
using Dignite.Abp.AspNetCore.Mvc.UI.Theme.Pure.Bundling;
using Dignite.Abp.AspNetCore.Mvc.UI.Theme.Pure.Demo.Bundling;
using Dignite.Abp.AspNetCore.Mvc.UI.Theme.Pure.Demo.Menus;
using Dignite.Abp.AspNetCore.Mvc.UI.Theme.Pure.Demo.Toolbars;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc.UI.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Packages.DatatablesNet;
using Volo.Abp.AspNetCore.Mvc.UI.Packages.DatatablesNetBs5;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared.Toolbars;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;
using Volo.Abp.UI.Navigation;
using Volo.Abp.VirtualFileSystem;

namespace Dignite.Abp.AspNetCore.Mvc.UI.Theme.Pure.Demo;

[DependsOn(
    typeof(DigniteAbpAspNetCoreMvcUiPureThemeModule),
    typeof(AbpAutofacModule)
    )]
public class DigniteAbpAspNetCoreMvcUiThemePureDemoModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var env = context.Services.GetHostingEnvironment();

        if (env.IsDevelopment())
        {
            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                options.FileSets.ReplaceEmbeddedByPhysical<DigniteAbpAspNetCoreMvcUiPureThemeModule>(Path.Combine(env.ContentRootPath, string.Format("..{0}..{0}src{0}Dignite.Abp.AspNetCore.Mvc.UI.Theme.Pure", Path.DirectorySeparatorChar)));
            });
        }

        Configure<AbpBundlingOptions>(options =>
        {
            var globalStyleBundles = options.StyleBundles.Get(PureThemeBundles.Styles.Global);
            var globalScriptBundles = options.ScriptBundles.Get(PureThemeBundles.Scripts.Global);

            /* remove datatable styles */
            globalStyleBundles.Contributors.Remove<DatatablesNetBs5StyleContributor>();
            globalStyleBundles.Contributors.Remove<SharedThemeGlobalStyleContributor>();

            /* remove datatable scripts */
            globalScriptBundles.Contributors.Remove<DatatablesNetScriptContributor>();
            globalScriptBundles.Contributors.Remove<DatatablesNetBs5ScriptContributor>();

            /*  */
            globalStyleBundles.AddContributors(typeof(PureThemeGlobalStyleDemoContributor));
            globalScriptBundles.AddContributors(typeof(PureThemeGlobalScriptDemoContributor));
        });

        Configure<AbpNavigationOptions>(options =>
        {
            options.MenuContributors.Add(new PureThemeDemoMenuContributor());
        });

        Configure<AbpToolbarOptions>(options =>
        {
            options.Contributors.Add(new PureThemeDemoToolbarContributor());
        });
    }

    public override void OnApplicationInitialization(ApplicationInitializationContext context)
    {
        var app = context.GetApplicationBuilder();
        var env = context.GetEnvironment();

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseStaticFiles();
        app.UseRouting();
        app.UseConfiguredEndpoints();
    }
}