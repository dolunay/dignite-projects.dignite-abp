﻿using System.Linq;
using System.Threading.Tasks;
using Dignite.Abp.TenantDomain;
using Microsoft.AspNetCore.Http;
using Volo.Abp.AspNetCore.MultiTenancy;
using Volo.Abp.MultiTenancy;

namespace Dignite.Abp.TenantDomainManagement.AspNetCore;

public class ProxyHeaderTenantResolveContributor : HttpTenantResolveContributorBase
{
    public const string ContributorName = "ProxyHeader";

    public override string Name => ContributorName;

    public ProxyHeaderTenantResolveContributor()
    {
    }

    protected override Task<string?> GetTenantIdOrNameFromHttpContextOrNullAsync(ITenantResolveContext context, HttpContext httpContext)
    {
        if (!httpContext.Request.Host.HasValue)
        {
            return Task.FromResult<string?>(null);
        }

        var tenantId = httpContext.Request.Headers[WebServerConsts.ProxyHeaderTenantId].FirstOrDefault();
        context.Handled = true;

        if (tenantId!=null)
        {
            return Task.FromResult<string?>(tenantId);
        }
        else
        {
            return Task.FromResult<string?>(null);
        }
    }
}