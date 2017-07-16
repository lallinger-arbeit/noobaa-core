/* Copyright (C) 2016 NooBaa */
'use strict';

const _ = require('lodash');
const util = require('util');

const P = require('../util/promise');
const dbg = require('../util/debug_module')(__filename);
const LRUCache = require('../util/lru_cache');
const cloud_utils = require('../util/cloud_utils');
const NamespaceNB = require('./namespace_nb');
const NamespaceS3 = require('./namespace_s3');
const NamespaceBlob = require('./namespace_blob');
const NamespaceMerge = require('./namespace_merge');

const bucket_namespace_cache = new LRUCache({
    name: 'ObjectSDK-Bucket-Namespace-Cache',
    expiry_ms: 0,
    max_usage: 1000,
    make_key: params => params.name,
    load: params => params.sdk._load_bucket_namespace(params),
    validate: (data, params) => params.sdk._validate_bucket_namespace(data, params),
});

const NAMESPACE_CACHE_EXPIRY = 60000;

class ObjectSDK {

    constructor(rpc_client, object_io) {
        this.rpc_client = rpc_client;
        this.object_io = object_io;
        this.nb = new NamespaceNB(this.rpc_client, this.object_io);
    }

    _get_bucket_namespace(name) {
        return bucket_namespace_cache.get_with_cache({
                sdk: this,
                name,
            })
            .then(data => data.ns);
    }

    _load_bucket_namespace(params) {
        return P.resolve(params.bucket || this.rpc_client.bucket.read_bucket({ name: params.name }))
            .then(bucket => this._setup_bucket_namespace(bucket));
    }

    _validate_bucket_namespace(data, params) {
        const time = Date.now();
        if (time <= data.valid_until) return true;
        return this.rpc_client.bucket.read_bucket({ name: params.name })
            .then(bucket => {
                if (!_.isEqual(bucket.namespace, data.bucket.namespace)) {
                    params.bucket = bucket;
                    return false;
                } else {
                    data.valid_until = time + NAMESPACE_CACHE_EXPIRY;
                    return true;
                }
            });
    }

    _setup_bucket_namespace(bucket) {
        const time = Date.now();
        dbg.log0('_load_bucket_namespace', util.inspect(bucket, true, null, true));
        try {
            if (bucket.namespace && bucket.namespace.list) {
                return {
                    ns: this._setup_merge_namespace(bucket),
                    bucket,
                    valid_until: time + NAMESPACE_CACHE_EXPIRY,
                };
            }
        } catch (err) {
            dbg.error('Failed to setup bucket namespace (fallback to no namespace)', err);
        }
        return {
            ns: this.nb,
            bucket,
            valid_until: time + NAMESPACE_CACHE_EXPIRY,
        };
    }

    _setup_merge_namespace(bucket) {
        if (bucket.namespace.list.length === 1) {
            return this._setup_single_namespace(bucket.namespace.list[0]);
        }
        return new NamespaceMerge(
            _.map(bucket.namespace.list,
                ns_info => this._setup_single_namespace(ns_info)
            )
        );
    }

    _setup_single_namespace(ns_info) {
        if (ns_info.endpoint_type === 'NOOBAA') {
            if (ns_info.target_bucket) {
                return new NamespaceNB(this.rpc_client, this.object_io, ns_info.target_bucket);
            } else {
                return this.nb;
            }
        }
        if (ns_info.endpoint_type === 'AWS' ||
            ns_info.endpoint_type === 'S3_COMPATIBLE') {
            return new NamespaceS3({
                params: { Bucket: ns_info.target_bucket },
                endpoint: ns_info.endpoint,
                accessKeyId: ns_info.access_key,
                secretAccessKey: ns_info.secret_key,
                region: 'us-east-1', // TODO needed?
                signatureVersion: 's3',
                s3ForcePathStyle: true,
                // computeChecksums: false, // disabled by default for performance
                // s3DisableBodySigning: true, // disabled by default for performance
            });
        }
        if (ns_info.endpoint_type === 'AZURE') {
            return new NamespaceBlob({
                container: ns_info.target_bucket,
                connection_string: cloud_utils.get_azure_connection_string(ns_info),
            });
        }
        throw new Error('Unrecognized namespace endpoint type ' + ns_info.endpoint_type);
    }

    set_auth_token(auth_token) {
        this.rpc_client.options.auth_token = auth_token;
    }

    get_auth_token() {
        return this.rpc_client.options.auth_token;
    }

    ////////////
    // BUCKET //
    ////////////

    list_buckets() {
        return this.rpc_client.bucket.list_buckets();
    }

    read_bucket(params) {
        return this.rpc_client.bucket.read_bucket(params);
    }

    create_bucket(params) {
        return this.rpc_client.bucket.create_bucket(params);
    }

    delete_bucket(params) {
        return this.rpc_client.bucket.delete_bucket(params);
    }

    //////////////////////
    // BUCKET LIFECYCLE //
    //////////////////////

    get_bucket_lifecycle_configuration_rules(params) {
        return this.rpc_client.bucket.get_bucket_lifecycle_configuration_rules(params);
    }

    set_bucket_lifecycle_configuration_rules(params) {
        return this.rpc_client.bucket.set_bucket_lifecycle_configuration_rules(params);
    }

    delete_bucket_lifecycle(params) {
        return this.rpc_client.bucket.delete_bucket_lifecycle(params);
    }

    ////////////////////////
    // BUCKET REPLICATION //
    ////////////////////////

    set_bucket_replication(params) {
        return this.rpc_client.bucket.set_cloud_sync(params);
    }

    delete_bucket_replication(params) {
        return this.rpc_client.bucket.delete_cloud_sync(params);
    }

    /////////////////
    // OBJECT LIST //
    /////////////////

    list_objects(params) {
        return this._get_bucket_namespace(params.bucket)
            .then(ns => ns.list_objects(params));
    }

    /////////////////
    // OBJECT READ //
    /////////////////

    read_object_md(params) {
        return this._get_bucket_namespace(params.bucket)
            .then(ns => ns.read_object_md(params));
    }

    read_object_stream(params) {
        return this._get_bucket_namespace(params.bucket)
            .then(ns => ns.read_object_stream(params));
    }

    ///////////////////
    // OBJECT UPLOAD //
    ///////////////////

    upload_object(params) {
        return this._get_bucket_namespace(params.bucket)
            .then(ns => ns.upload_object(params));
    }

    /////////////////////////////
    // OBJECT MULTIPART UPLOAD //
    /////////////////////////////

    create_object_upload(params) {
        return this._get_bucket_namespace(params.bucket)
            .then(ns => ns.create_object_upload(params));
    }

    upload_multipart(params) {
        return this._get_bucket_namespace(params.bucket)
            .then(ns => ns.upload_multipart(params));
    }

    list_multiparts(params) {
        return this._get_bucket_namespace(params.bucket)
            .then(ns => ns.list_multiparts(params));
    }

    complete_object_upload(params) {
        return this._get_bucket_namespace(params.bucket)
            .then(ns => ns.complete_object_upload(params));
    }

    abort_object_upload(params) {
        return this._get_bucket_namespace(params.bucket)
            .then(ns => ns.abort_object_upload(params));
    }

    ///////////////////
    // OBJECT DELETE //
    ///////////////////

    delete_object(params) {
        return this._get_bucket_namespace(params.bucket)
            .then(ns => ns.delete_object(params));
    }

    delete_multiple_objects(params) {
        return this._get_bucket_namespace(params.bucket)
            .then(ns => ns.delete_multiple_objects(params));
    }

}

module.exports = ObjectSDK;