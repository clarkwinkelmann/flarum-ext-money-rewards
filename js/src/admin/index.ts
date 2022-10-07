import app from 'flarum/admin/app';

app.initializers.add('clarkwinkelmann-money-rewards', () => {
    app.extensionData
        .for('clarkwinkelmann-money-rewards')
        .registerSetting({
            type: 'text',
            setting: 'money-rewards.preselection',
            label: app.translator.trans('clarkwinkelmann-money-rewards.admin.settings.preselection'),
        })
        .registerSetting({
            type: 'number',
            setting: 'money-rewards.min',
            label: app.translator.trans('clarkwinkelmann-money-rewards.admin.settings.min'),
            min: 0,
        })
        .registerSetting({
            type: 'number',
            setting: 'money-rewards.max',
            label: app.translator.trans('clarkwinkelmann-money-rewards.admin.settings.max'),
            min: 0,
        })
        .registerSetting({
            type: 'number',
            setting: 'money-rewards.decimals',
            label: app.translator.trans('clarkwinkelmann-money-rewards.admin.settings.decimals'),
            min: 0,
        })
        .registerPermission({
            permission: 'money-rewards.seeMoneyRewardHistory',
            icon: 'fas fa-money-bill',
            label: app.translator.trans('clarkwinkelmann-money-rewards.admin.permissions.seeMoneyRewardHistory'),
            allowGuest: true,
        }, 'view')
        .registerPermission({
            permission: 'discussion.rewardPostsWithMoney',
            icon: 'fas fa-money-bill',
            label: app.translator.trans('clarkwinkelmann-money-rewards.admin.permissions.rewardWithMoney'),
        }, 'reply')
        .registerPermission({
            permission: 'money-rewards.customAmounts',
            icon: 'fas fa-money-bill',
            label: app.translator.trans('clarkwinkelmann-money-rewards.admin.permissions.customAmounts'),
        }, 'reply')
        .registerPermission({
            permission: 'money-rewards.createMoney',
            icon: 'fas fa-money-bill',
            label: app.translator.trans('clarkwinkelmann-money-rewards.admin.permissions.createMoney'),
        }, 'moderate');
});
