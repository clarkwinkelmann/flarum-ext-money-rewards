import app from 'flarum/forum/app';
import UserPage from 'flarum/forum/components/UserPage';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import humanTime from 'flarum/common/helpers/humanTime';
import extractText from 'flarum/common/utils/extractText';
import {ApiPayloadPlural} from 'flarum/common/Store';
import Reward from '../models/Reward';
import FormattedMoney from './FormattedMoney';

export default class RewardHistoryPage extends UserPage {
    loading: boolean = true
    rewards: Reward[] = []

    oninit(vnode: any) {
        super.oninit(vnode);

        this.loadUser(m.route.param('username'));
    }

    show(user: any) {
        super.show(user);

        app.setTitle(extractText(app.translator.trans('clarkwinkelmann-money-rewards.forum.profile.title')));

        this.loadRewards();
    }

    loadRewards() {
        app.request<ApiPayloadPlural>({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + '/users/' + this.user!.id() + '/money-rewards',
        }).then(payload => {
            this.rewards = app.store.pushPayload<Reward[]>(payload);
            this.loading = false;
            m.redraw();
        });
    }

    content() {
        if (this.loading) {
            return LoadingIndicator.component();
        }

        return m('ul.MoneyRewardHistoryPage', [
            this.rewards.map(reward => {
                const giver = reward.giver() || null;
                const receiver = reward.receiver() || null;

                return m('li', [
                    FormattedMoney.component({
                        money: reward.amount(),
                    }),
                    ' from ',
                    avatar(giver),
                    username(giver),
                    ' to ',
                    avatar(receiver),
                    username(receiver),
                    ' on ',
                    humanTime(reward.createdAt()),
                    m('div', m('em', reward.comment())),
                ]);
            }),
        ]);
    }
}
