/* Copyright (C) 2016 NooBaa */

import './chartjs-binding';
import template from './chartjs.html';
import BaseViewModel from 'components/base-view-model';

class chartJSViewModel extends BaseViewModel {
    constructor({ type = 'line', data = {}, options = {} }) {
        super();
        this.config = { type, options, data };
    }
}

export default {
    viewModel: chartJSViewModel,
    template: template
};
