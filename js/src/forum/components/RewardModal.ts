import app from 'flarum/forum/app';
import Modal, {IInternalModalAttrs} from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Switch from 'flarum/common/components/Switch';
import {ApiPayloadSingle} from 'flarum/common/Store';
import Post from 'flarum/common/models/Post';
import FormattedMoney from './FormattedMoney';

interface RewardModalAttrs extends IInternalModalAttrs {
    post: Post
}

export default class RewardModal extends Modal<RewardModalAttrs> {
    preselectAmount: number = 0
    customAmount: boolean = false
    customAmountValue: string = ''
    createMoney: boolean = false
    comment: string = ''

    oninit(vnode: any) {
        super.oninit(vnode);

        if ((app.forum.attribute<string[]>('moneyRewardsPreselection') || []).length === 0) {
            this.customAmount = true;
        }
    }

    className() {
        return 'Modal--small';
    }

    title() {
        return app.translator.trans('clarkwinkelmann-money-rewards.forum.modal.title');
    }

    content() {
        const preselection = app.forum.attribute<string[]>('moneyRewardsPreselection') || [];

        return m('.Modal-body', [
            m('.Form-group', [
                app.translator.trans('clarkwinkelmann-money-rewards.forum.modal.target', {
                    number: this.attrs.post.number(),
                    user: this.attrs.post.user(),
                }),
            ]),
            preselection.length > 0 ? m('.Form-group', [
                preselection.map((amount, index) => {
                    return m('label', [
                        m('input', {
                            type: 'radio',
                            name: 'money-reward-preselection',
                            checked: this.preselectAmount === index && !this.customAmount,
                            onchange: () => {
                                this.preselectAmount = index;
                                this.customAmount = false;
                            },
                        }),
                        ' ',
                        FormattedMoney.component({
                            money: amount,
                        }),
                    ]);
                }),
                app.forum.attribute('moneyRewardsCustomAmounts') ? m('label', [
                    m('input', {
                        type: 'radio',
                        name: 'money-reward-preselection',
                        checked: this.customAmount,
                        onchange: () => {
                            this.customAmount = true;
                        },
                    }),
                    ' ',
                    app.translator.trans('clarkwinkelmann-money-rewards.forum.modal.optionCustom'),
                ]) : null,
            ]) : null,
            this.customAmount ? m('.Form-group', [
                m('label', app.translator.trans('clarkwinkelmann-money-rewards.forum.modal.label.custom')),
                m('input.FormControl', {
                    type: 'number',
                    value: this.customAmountValue,
                    onchange: (event: InputEvent) => {
                        this.customAmountValue = (event.target as HTMLInputElement).value;
                    },
                    min: app.forum.attribute('moneyRewardsCustomAmountsMin'),
                    max: app.forum.attribute('moneyRewardsCustomAmountsMax') || undefined,
                    step: 1 / Math.pow(10, app.forum.attribute('moneyRewardsCustomAmountsDecimals')),
                }),
            ]) : '',
            m('.Form-group', [
                app.translator.trans('clarkwinkelmann-money-rewards.forum.modal.balance', {
                    amount: FormattedMoney.component({
                        money: app.session.user!.attribute('money'),
                    })
                }),
            ]),
            app.forum.attribute('moneyRewardsCreateMoney') ? m('.Form-group', [
                Switch.component({
                    state: this.createMoney,
                    onchange: (value: boolean) => {
                        this.createMoney = value;
                    },
                }, app.translator.trans('clarkwinkelmann-money-rewards.forum.modal.label.create')),
            ]) : null,
            m('.Form-group', [
                m('label', app.translator.trans('clarkwinkelmann-money-rewards.forum.modal.label.comment')),
                m('textarea.FormControl', {
                    value: this.comment,
                    onchange: (event: InputEvent) => {
                        this.comment = (event.target as HTMLInputElement).value;
                    },
                }),
            ]),
            m('.Form-group', Button.component({
                type: 'submit',
                className: 'Button Button--primary',
                loading: this.loading,
            }, app.translator.trans('clarkwinkelmann-money-rewards.forum.modal.submit'))),
        ]);
    }

    onsubmit(event: Event) {
        event.preventDefault();

        this.loading = true;

        app.request<ApiPayloadSingle>({
            method: 'POST',
            url: app.forum.attribute('apiUrl') + '/posts/' + this.attrs.post.id() + '/money-rewards',
            errorHandler: this.onerror.bind(this),
            body: {
                data: {
                    attributes: {
                        amount: this.customAmount ? this.customAmountValue : app.forum.attribute<string[]>('moneyRewardsPreselection')[this.preselectAmount],
                        createMoney: this.createMoney,
                        comment: this.comment,
                    },
                },
            },
        })
            .then(payload => {
                app.store.pushPayload(payload);

                this.hide();

                app.alerts.show({type: 'success'}, app.translator.trans('clarkwinkelmann-money-rewards.forum.modal.success'));
            })
            .catch(() => {
                this.loading = false;
                m.redraw();
            });
    }
}
