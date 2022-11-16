﻿using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Dignite.Abp.SettingManagement;

public interface IGlobalSettingsAppService : IApplicationService
{
    Task<ListResultDto<SettingProviderDto>> GetAllAsync();

    Task UpdateAsync(UpdateGlobalSettingsInput input);
}