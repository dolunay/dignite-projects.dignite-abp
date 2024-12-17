// This file is automatically generated by ABP framework to use MVC Controllers from CSharp
using Dignite.CmsKit.Brand;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Http.Client;
using Volo.Abp.Http.Client.ClientProxying;
using Volo.Abp.Http.Modeling;

// ReSharper disable once CheckNamespace
namespace Dignite.CmsKit.Brand;

[Dependency(ReplaceServices = true)]
[ExposeServices(typeof(IBrandAppService), typeof(BrandClientProxy))]
public partial class BrandClientProxy : ClientProxyBase<IBrandAppService>, IBrandAppService
{
    public virtual async Task<BrandDto> GetAsync()
    {
        return await RequestAsync<BrandDto>(nameof(GetAsync));
    }
}
