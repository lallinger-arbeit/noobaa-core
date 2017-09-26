/* Copyright (C) 2016 NooBaa */

import { refreshLocation } from 'action-creators';
import {
    COMPLETE_CREATE_ACCOUNT,
    COMPLETE_UPDATE_ACCOUNT_S3_ACCESS,
    COMPLETE_UPDATE_BUCKET_QUOTA,
    COMPLETE_SET_ACCOUNT_IP_RESTRICTIONS,
    COMPLETE_ADD_EXTERNAL_CONNECTION,
    COMPLETE_DELETE_RESOURCE,
    COMPLETE_DELETE_EXTERNAL_CONNECTION,
    COMPLETE_CREATE_HOSTS_POOL,
    COMPLETE_ASSIGN_HOSTS_TO_POOL,
    COMPLETE_SET_HOST_DEBUG_MODE,
    COMPLETE_TOGGLE_HOST_SERVICES,
    COMPLETE_TOGGLE_HOST_NODES,
    COMPLETE_DELETE_ACCOUNT,
    COMPLETE_CREATE_NAMESPACE_RESOURCE,
    COMPLETE_DELETE_NAMESPACE_RESOURCE,
    COMPLETE_CREATE_GATEWAY_BUCKET,
    COMPLETE_UPDATE_GATEWAY_BUCKET_PLACEMENT,
    COMPLETE_DELETE_GATEWAY_BUCKET
} from 'action-types';

export default function(action$) {
    return action$
        .ofType(
            COMPLETE_CREATE_ACCOUNT,
            COMPLETE_UPDATE_ACCOUNT_S3_ACCESS,
            COMPLETE_UPDATE_BUCKET_QUOTA,
            COMPLETE_SET_ACCOUNT_IP_RESTRICTIONS,
            COMPLETE_ADD_EXTERNAL_CONNECTION,
            COMPLETE_DELETE_RESOURCE,
            COMPLETE_DELETE_EXTERNAL_CONNECTION,
            COMPLETE_CREATE_HOSTS_POOL,
            COMPLETE_ASSIGN_HOSTS_TO_POOL,
            COMPLETE_SET_HOST_DEBUG_MODE,
            COMPLETE_TOGGLE_HOST_SERVICES,
            COMPLETE_TOGGLE_HOST_NODES,
            COMPLETE_DELETE_ACCOUNT,
            COMPLETE_CREATE_NAMESPACE_RESOURCE,
            COMPLETE_DELETE_NAMESPACE_RESOURCE,
            COMPLETE_CREATE_GATEWAY_BUCKET,
            COMPLETE_UPDATE_GATEWAY_BUCKET_PLACEMENT,
            COMPLETE_DELETE_GATEWAY_BUCKET
        )
        .map(() => refreshLocation());
}