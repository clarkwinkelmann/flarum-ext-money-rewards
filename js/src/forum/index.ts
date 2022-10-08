import {extend} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import LinkButton from 'flarum/common/components/LinkButton';
import Model from 'flarum/common/Model';
import Post from 'flarum/common/models/Post';
import UserPage from 'flarum/forum/components/UserPage';
import CommentPost from 'flarum/forum/components/CommentPost';
import PostControls from 'flarum/forum/utils/PostControls';
import extractText from 'flarum/common/utils/extractText';
import Reward from './models/Reward';
import RewardHistoryPage from './components/RewardHistoryPage';
import RewardModal from './components/RewardModal';
import PostRewards from './components/PostRewards';

app.initializers.add('clarkwinkelmann-money-rewards', () => {
    app.routes.userMoneyRewardHistory = {
        path: '/u/:username/rewards',
        component: RewardHistoryPage,
    };

    app.store.models['money-rewards'] = Reward;

    // @ts-ignore
    Post.prototype.moneyRewards = Model.hasMany('moneyRewards');

    extend(UserPage.prototype, 'navItems', function (items) {
        if (!this.user || !this.user.attribute('canSeeMoneyRewardHistory')) {
            return;
        }

        items.add('money-rewards', LinkButton.component({
            href: app.route('userMoneyRewardHistory', {
                username: this.user.slug(),
            }),
            icon: 'fas fa-money-bill',
        }, app.translator.trans('clarkwinkelmann-money-rewards.forum.profile.nav')));
    });

    extend(PostControls, 'userControls', function (items, post: Post) {
        if (!post.attribute('rewardWithMoney')) {
            if (post.attribute('contentType') === 'comment' && app.session.user) {
                items.add('money-reward', Button.component({
                    icon: 'fas fa-gift',
                    className: 'disabled', // Setting just the class so you can still actually click the button
                    onclick: () => {
                        alert(extractText(app.translator.trans('clarkwinkelmann-money-rewards.forum.post.disallowed' + (post.user() === app.session.user ? 'Own' : 'Other'))));
                    },
                }, app.translator.trans('clarkwinkelmann-money-rewards.forum.post.action')));
            }

            return;
        }

        items.add('money-reward', Button.component({
            onclick: () => {
                app.modal.show(RewardModal, {
                    post,
                });
            },
            icon: 'fas fa-gift',
        }, app.translator.trans('clarkwinkelmann-money-rewards.forum.post.action')));
    });

    extend(CommentPost.prototype, 'content', function (content) {
        content.push(PostRewards.component({
            post: this.attrs.post,
        }));
    });
});
