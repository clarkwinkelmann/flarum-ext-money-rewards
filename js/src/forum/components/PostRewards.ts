import app from 'flarum/forum/app';
import Component, {ComponentAttrs} from 'flarum/common/Component';
import Post from 'flarum/common/models/Post';
import Reward from '../models/Reward';
import RewardRecord from './RewardRecord';

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

        return m('.PostMoneyRewards', [
            m('h4', app.translator.trans('clarkwinkelmann-money-rewards.forum.post.section')),
            m('ul.MoneyRewardRecords', rewards.map(reward => RewardRecord.component({reward}))),
        ]);
    }
}
