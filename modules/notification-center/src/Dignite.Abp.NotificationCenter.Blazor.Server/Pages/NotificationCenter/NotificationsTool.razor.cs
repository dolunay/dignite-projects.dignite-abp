﻿using System;
using System.Net;
using System.Threading.Tasks;
using Dignite.Abp.NotificationCenter.Blazor.Pages.NotificationCenter;
using Dignite.Abp.NotificationCenter.Localization;
using Dignite.Abp.Notifications;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR.Client;

namespace Dignite.Abp.NotificationCenter.Blazor.Server.Pages.NotificationCenter;
public partial class NotificationsTool: IAsyncDisposable
{
    [Inject]
    private IHttpContextAccessor HttpContextAccessor { get; set; }

    [Inject]
    private NavigationManager Navigation { get; set; }

    [Inject] INotificationAppService NotificationAppService { get; set; }

    /// <summary>
    /// Hub Connection
    /// </summary>
    private HubConnection hubConnection;

    /// <summary>
    /// notification count
    /// </summary>
    private int notificationCount = 0;

    private SubscribeModal SubscribeModalRef;

    protected override async Task OnInitializedAsync()
    {
        LocalizationResource = typeof(NotificationCenterResource);
        if (CurrentUser.IsAuthenticated)
        {
            hubConnection = new HubConnectionBuilder()
                .WithUrl(Navigation.ToAbsoluteUri("/signalr-hubs/notifications"), options =>
                {
                    /*
                     * When connecting with the signalr, you need to tell the signalr hub the connection user information, so the current user is configured here
                     * See:https://github.com/abpframework/abp/issues/8683
                    */
                    if (HttpContextAccessor.HttpContext != null)
                    {
                        foreach (var cookie in HttpContextAccessor.HttpContext.Request.Cookies)
                        {
                            options.Cookies.Add(new Cookie(cookie.Key, cookie.Value, null, HttpContextAccessor.HttpContext.Request.Host.Host));
                        }
                    }
                })
                .Build();

            notificationCount = await NotificationAppService.GetCountAsync(UserNotificationState.Unread);

            hubConnection.On<RealTimeNotifyEto>("ReceiveNotifications", (notification) =>
            {
                notificationCount++;
                InvokeAsync(StateHasChanged);
            });

            await hubConnection.StartAsync();
        }

        await base.OnInitializedAsync();
    }

    private async Task OpenSubscribeModalAsync()
    {
        await SubscribeModalRef.OpenCreateModalAsync();
    }

    public async ValueTask DisposeAsync()
    {
        if (hubConnection is not null)
        {
            await hubConnection.DisposeAsync();
        }
    }
}
