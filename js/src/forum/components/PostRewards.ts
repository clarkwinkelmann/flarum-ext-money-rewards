import Component, {ComponentAttrs} from 'flarum/common/Component';
import Post from 'flarum/common/models/Post';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import Reward from '../models/Reward';
import FormattedMoney from './FormattedMoney';

interface PostRewardsAttrs extends ComponentAttrs {
    post: Post
}

export default class PostRewards extends Component<PostRewardsAttrs> {
    view() {
        // @ts-ignore
        const rewards: Reward[] = this.attrs.post.moneyRewards();

        if (!Array.isArray(rewards) || rewards.length === 0) {
            return null;
        }

        return m('ul.PostMoneyRewards', rewards.map(reward => {
            const giver = reward.giver() || null;

            return m('li.PostMoneyReward', [
                FormattedMoney.component({
                    money: reward.amount(),
                }),
                ' by ',
                avatar(giver),
                username(giver),
                m('div', m('em', reward.comment())),
            ])
        }));
    }
}
