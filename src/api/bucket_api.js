/* Copyright (C) 2016 NooBaa */
'use strict';

/**
 *
 * BUCKET API
 *
 * client (currently web client) talking to the web server to work on bucket
 *
 */
module.exports = {

    id: 'bucket_api',

    methods: {

        create_bucket: {
            method: 'POST',
            params: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: { type: 'string' },
                    // if tiering is provided then chunk_coder_config & chunk_split_config are ignored!
                    tiering: { type: 'string' },
                    chunk_split_config: { $ref: 'common_api#/definitions/chunk_split_config' },
                    chunk_coder_config: { $ref: 'common_api#/definitions/chunk_coder_config' },
                    tag: { type: 'string' },
                    namespace: {
                        type: 'object',
                        required: ['write_resource', 'read_resources'],
                        properties: {
                            write_resource: {
                                type: 'string'
                            },
                            read_resources: {
                                type: 'array',
                                items: {
                                    type: 'string'
                                },
                            }
                        }
                    }
                }
            },
            reply: {
                $ref: '#/definitions/bucket_info'
            },
            auth: {
                system: 'admin'
            }
        },

        read_bucket: {
            method: 'GET',
            params: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: {
                        type: 'string',
                    },
                }
            },
            reply: {
                $ref: '#/definitions/bucket_info'
            },
            auth: {
                system: 'admin'
            }
        },

        get_bucket_namespaces: {
            method: 'GET',
            params: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: {
                        type: 'string',
                    },
                }
            },
            reply: {
                anyOf: [{
                    $ref: '#/definitions/bucket_namespaces_info'
                }, {
                    $ref: '#/definitions/bucket_info'
                }]
            },
            auth: {
                system: 'admin'
            }
        },

        update_bucket: {
            method: 'PUT',
            params: {
                $ref: '#/definitions/update_bucket_params'
            },
            auth: {
                system: 'admin'
            }
        },

        update_buckets: {
            method: 'PUT',
            params: {
                type: 'array',
                items: {
                    $ref: '#/definitions/update_bucket_params'
                },
            },
            auth: {
                system: 'admin'
            }
        },

        delete_bucket: {
            method: 'DELETE',
            params: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: {
                        type: 'string',
                    },
                }
            },
            auth: {
                system: 'admin'
            }
        },

        delete_bucket_lifecycle: {
            method: 'DELETE',
            params: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: {
                        type: 'string',
                    },
                }
            },
            auth: {
                system: 'admin'
            }
        },

        list_buckets: {
            method: 'GET',
            reply: {
                type: 'object',
                required: ['buckets'],
                properties: {
                    buckets: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: ['name'],
                            properties: {
                                name: {
                                    type: 'string'
                                },
                            }
                        }
                    }
                }
            },
            auth: {
                system: 'admin'
            }
        },

        update_bucket_s3_access: {
            method: 'PUT',
            params: {
                type: 'object',
                required: ['name', 'allowed_accounts'],
                properties: {
                    name: {
                        type: 'string',
                    },
                    allowed_accounts: {
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    }
                }
            },
            auth: {
                system: 'admin'
            }
        },

        export_bucket_bandwidth_usage: {
            method: 'GET',
            params: {
                type: 'object',
                required: ['name', 'since', 'till'],
                properties: {
                    name: {
                        type: 'string',
                    },
                    since: {
                        idate: true
                    },
                    till: {
                        idate: true
                    },
                }
            },
            reply: {
                type: 'string',
            },
            auth: {
                system: 'admin'
            }
        },

        get_cloud_sync: {
            method: 'GET',
            params: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: {
                        type: 'string',
                    },
                }
            },
            reply: {
                $ref: '#/definitions/cloud_sync_info'
            },
            auth: {
                system: 'admin'
            }
        },

        get_all_cloud_sync: {
            method: 'GET',
            reply: {
                type: 'array',
                items: {
                    $ref: '#/definitions/cloud_sync_info'
                }
            },
            auth: {
                system: 'admin'
            }
        },

        delete_cloud_sync: {
            method: 'DELETE',
            params: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: {
                        type: 'string'
                    }
                }
            },
            auth: {
                system: 'admin'
            }
        },

        set_cloud_sync: {
            method: 'PUT',
            params: {
                type: 'object',
                required: ['name', 'policy'],
                properties: {
                    name: {
                        type: 'string'
                    },
                    connection: {
                        type: 'string'
                    },
                    target_bucket: {
                        type: 'string'
                    },
                    policy: {
                        $ref: '#/definitions/cloud_sync_policy'
                    }
                }
            },
            auth: {
                system: 'admin'
            }
        },

        update_cloud_sync: {
            method: 'PUT',
            params: {
                type: 'object',
                required: ['name', 'policy'],
                properties: {
                    name: {
                        type: 'string'
                    },
                    policy: {
                        $ref: '#/definitions/cloud_sync_policy'
                    }
                }
            },
            auth: {
                system: 'admin'
            }
        },

        toggle_cloud_sync: {
            method: 'PUT',
            params: {
                type: 'object',
                required: ['name', 'pause'],
                properties: {
                    name: {
                        type: 'string'
                    },
                    pause: {
                        type: 'boolean'
                    }
                }
            },
            auth: {
                system: 'admin'
            }
        },

        get_cloud_buckets: {
            method: 'GET',
            params: {
                type: 'object',
                required: ['connection'],
                properties: {
                    connection: {
                        type: 'string'
                    }
                }
            },
            reply: {
                type: 'array',
                items: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: {
                            type: 'string'
                        },
                        used_by: {
                            type: 'object',
                            required: ['name', 'usage_type'],
                            properties: {
                                name: {
                                    type: 'string'
                                },
                                usage_type: {
                                    type: 'string',
                                    enum: ['CLOUD_SYNC', 'CLOUD_RESOURCE', 'NAMESPACE_RESOURCE']
                                },
                            }
                        }
                    }
                }
            },
            auth: {
                system: 'admin'
            }
        },
        set_bucket_lifecycle_configuration_rules: {
            method: 'PUT',
            params: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    },
                    rules: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: ['id', 'prefix', 'status', 'expiration'],
                            properties: {
                                id: {
                                    type: 'string'
                                },
                                prefix: {
                                    type: 'string'
                                },
                                status: {
                                    type: 'string'
                                },
                                expiration: {
                                    type: 'object',
                                    properties: {
                                        days: {
                                            type: 'integer'
                                        },
                                        date: {
                                            idate: true
                                        },
                                        expired_object_delete_marker: {
                                            type: 'boolean'
                                        }

                                    }
                                },
                                abort_incomplete_multipart_upload: {
                                    type: 'object',
                                    properties: {
                                        days_after_initiation: {
                                            type: 'integer'
                                        },
                                    }
                                },
                                transition: {
                                    type: 'object',
                                    properties: {
                                        date: {
                                            idate: true
                                        },
                                        storage_class: {
                                            $ref: '#/definitions/storage_class_enum'
                                        }
                                    }
                                },
                                noncurrent_version_expiration: {
                                    type: 'object',
                                    properties: {
                                        noncurrent_days: {
                                            type: 'integer'
                                        },
                                    }
                                },
                                noncurrent_version_transition: {
                                    type: 'object',
                                    properties: {
                                        noncurrent_days: {
                                            type: 'integer'
                                        },
                                        storage_class: {
                                            $ref: '#/definitions/storage_class_enum'
                                        }
                                    }
                                },
                            }
                        },
                    }
                }
            },
            auth: {
                system: 'admin'
            },
        },
        get_bucket_lifecycle_configuration_rules: {
            method: 'GET',
            params: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    }
                }
            },
            reply: {
                type: 'array',
                items: {
                    type: 'object',
                    required: ['id', 'prefix', 'status', 'expiration'],
                    properties: {
                        id: {
                            type: 'string'
                        },
                        prefix: {
                            type: 'string'
                        },
                        status: {
                            type: 'string'
                        },
                        last_sync: {
                            idate: true
                        },
                        expiration: {
                            type: 'object',
                            properties: {
                                days: {
                                    type: 'integer'
                                },
                                date: {
                                    idate: true
                                },
                                expired_object_delete_marker: {
                                    type: 'boolean'
                                }

                            }
                        },
                        abort_incomplete_multipart_upload: {
                            type: 'object',
                            properties: {
                                days_after_initiation: {
                                    type: 'integer'
                                },
                            }
                        },
                        transition: {
                            type: 'object',
                            properties: {
                                date: {
                                    idate: true
                                },
                                storage_class: {
                                    $ref: '#/definitions/storage_class_enum'
                                }
                            }
                        },
                        noncurrent_version_expiration: {
                            type: 'object',
                            properties: {
                                noncurrent_days: {
                                    type: 'integer'
                                },
                            }
                        },
                        noncurrent_version_transition: {
                            type: 'object',
                            properties: {
                                noncurrent_days: {
                                    type: 'integer'
                                },
                                storage_class: {
                                    $ref: '#/definitions/storage_class_enum'
                                }
                            }
                        },
                    },
                }
            },
            auth: {
                system: 'admin'
            }
        },
        add_bucket_lambda_trigger: {
            method: 'PUT',
            params: {
                $ref: '#/definitions/new_lambda_trigger'
            },
            auth: {
                system: 'admin'
            }
        },
        delete_bucket_lambda_trigger: {
            method: 'DELETE',
            required: ['id', 'bucket_name'],
            params: {
                type: 'object',
                properties: {
                    id: {
                        objectid: true
                    },
                    bucket_name: {
                        type: 'string'
                    }
                }
            },
            auth: {
                system: 'admin'
            }
        },
        update_bucket_lambda_trigger: {
            method: 'PUT',
            params: {
                $ref: '#/definitions/update_lambda_trigger'
            },
            auth: {
                system: 'admin'
            }
        }
    },

    definitions: {

        bucket_info: {
            type: 'object',
            required: ['name', 'bucket_type', 'tiering', 'usage_by_pool', 'storage', 'data', 'num_objects', 'host_tolerance', 'node_tolerance', 'writable', 'mode'],
            properties: {
                name: {
                    type: 'string',
                },
                bucket_type: {
                    enum: ['REGULAR', 'NAMESPACE'],
                    type: 'string',
                },
                namespace: {
                    $ref: '#/definitions/bucket_namespace'
                },
                tiering: {
                    $ref: 'tiering_policy_api#/definitions/tiering_policy'
                },
                spillover: {
                    type: 'string'
                },
                storage: {
                    type: 'object',
                    properties: {
                        values: {
                            $ref: 'common_api#/definitions/storage_info'
                        },
                        last_update: {
                            idate: true
                        }
                    }
                },
                quota: {
                    type: 'object',
                    required: ['size', 'unit'],
                    properties: {
                        size: {
                            type: 'integer'
                        },
                        unit: {
                            type: 'string',
                            enum: ['GIGABYTE', 'TERABYTE', 'PETABYTE']
                        },
                    }
                },
                data: {
                    type: 'object',
                    properties: {
                        // This is the sum of all compressed chunks that are related to the bucket.
                        // Which means that it includes dedup and compression, but not replicas.
                        size_reduced: {
                            $ref: 'common_api#/definitions/bigint'
                        },
                        // This is logical size aggregation of objects that are related to the bucket.
                        size: {
                            $ref: 'common_api#/definitions/bigint'
                        },
                        // This is the actual free space of the bucket considering data placement policy.
                        // On mirror it is the minimum free space of the pools, on spread it is the sum.
                        // Also we divide by replicas in order to get the actual size that can be written.
                        free: {
                            $ref: 'common_api#/definitions/bigint'
                        },
                        available_for_upload: {
                            $ref: 'common_api#/definitions/bigint'
                        },
                        spillover_free: {
                            $ref: 'common_api#/definitions/bigint'
                        },
                        last_update: {
                            idate: true
                        }
                    }
                },
                usage_by_pool: {
                    type: 'object',
                    required: ['last_update', 'pools'],
                    properties: {
                        last_update: {
                            idate: true
                        },
                        pools: {
                            type: 'array',
                            items: {
                                type: 'object',
                                required: ['pool_name', 'storage'],
                                properties: {
                                    pool_name: {
                                        type: 'string'
                                    },
                                    storage: {
                                        type: 'object',
                                        required: ['blocks_size'],
                                        properties: {
                                            blocks_size: {
                                                $ref: 'common_api#/definitions/bigint'
                                            },
                                        },
                                    }
                                },
                            },
                        },
                    }
                },
                num_objects: {
                    type: 'integer'
                },
                host_tolerance: {
                    type: 'integer'
                },
                node_tolerance: {
                    type: 'integer'
                },
                cloud_sync: {
                    $ref: '#/definitions/cloud_sync_info'
                },
                tag: {
                    type: 'string'
                },
                writable: {
                    type: 'boolean'
                },
                stats: {
                    type: 'object',
                    properties: {
                        reads: {
                            type: 'integer'
                        },
                        writes: {
                            type: 'integer'
                        },
                        last_read: {
                            idate: true
                        },
                        last_write: {
                            idate: true
                        },
                    },
                },
                policy_modes: {
                    $ref: '#/definitions/policy_modes'
                },
                mode: {
                    $ref: '#/definitions/bucket_mode'
                },
                undeletable: {
                    $ref: '#/definitions/undeletable_bucket_reason'
                },
                triggers: {
                    type: 'array',
                    items: {
                        $ref: '#/definitions/lambda_trigger_info'
                    }
                }
            }
        },

        cloud_sync_info: {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                },
                endpoint: {
                    type: 'string'
                },
                endpoint_type: {
                    type: 'string',
                    enum: ['AWS', 'AZURE', 'S3_COMPATIBLE']
                },
                access_key: {
                    type: 'string'
                },
                target_bucket: {
                    type: 'string'
                },
                policy: {
                    $ref: '#/definitions/cloud_sync_policy'
                },
                health: {
                    type: 'boolean'
                },
                status: {
                    $ref: '#/definitions/api_cloud_sync_status'
                },
                last_sync: {
                    idate: true
                },
            }
        },

        cloud_sync_policy: {
            type: 'object',
            required: ['schedule_min'],
            properties: {
                schedule_min: {
                    type: 'integer'
                },
                c2n_enabled: {
                    type: 'boolean',
                },
                n2c_enabled: {
                    type: 'boolean',
                },
                //If true, only additions will be synced
                additions_only: {
                    type: 'boolean',
                },
                paused: {
                    type: 'boolean'
                }
            }
        },

        bucket_namespace: {
            type: 'object',
            required: [
                'read_resources',
                'write_resource',
            ],
            properties: {
                read_resources: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                write_resource: {
                    type: 'string'
                }
            }
        },

        bucket_namespaces_info: {
            type: 'object',
            required: [
                'name',
                'namespace'
            ],
            properties: {
                name: {
                    type: 'string'
                },
                namespace: {
                    type: 'object',
                    required: [
                        'read_resources',
                        'write_resource',
                    ],
                    properties: {
                        read_resources: {
                            type: 'array',
                            items: {
                                $ref: 'pool_api#/definitions/namespace_resource_extended_info'
                            }
                        },
                        write_resource: {
                            $ref: 'pool_api#/definitions/namespace_resource_extended_info'
                        }
                    },
                },
                proxy: {
                    type: 'string'
                }
            }
        },

        api_cloud_sync_status: {
            enum: ['PENDING', 'SYNCING', 'UNABLE', 'SYNCED', 'NOTSET'],
            type: 'string',
        },

        storage_class_enum: {
            enum: ['STANDARD_IA', 'GLACIER'],
            type: 'string'
        },
        update_bucket_params: {
            type: 'object',
            required: ['name'],
            properties: {
                name: {
                    type: 'string',
                },
                new_name: {
                    type: 'string',
                },
                tiering: {
                    type: 'string',
                },
                new_tag: {
                    type: 'string',
                },
                quota: {
                    anyOf: [{
                        type: 'null'
                    }, {
                        type: 'object',
                        required: ['size', 'unit'],
                        properties: {
                            size: {
                                type: 'integer'
                            },
                            unit: {
                                type: 'string',
                                enum: ['GIGABYTE', 'TERABYTE', 'PETABYTE']
                            },
                        }
                    }]
                },
                spillover: {
                    oneOf: [{
                        type: 'string'
                    }, {
                        type: 'null'
                    }]
                },
                namespace: {
                    type: 'object',
                    required: ['write_resource', 'read_resources'],
                    properties: {
                        write_resource: {
                            type: 'string'
                        },
                        read_resources: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                        }
                    }
                }
            }
        },
        policy_modes: {
            type: 'object',
            required: ['placement_status', 'resiliency_status', 'quota_status', 'spillover_status'],
            properties: {
                placement_status: {
                    type: 'string',
                    enum: [
                        'NO_RESOURCES',
                        'NOT_ENOUGH_RESOURCES',
                        'NOT_ENOUGH_HEALTHY_RESOURCES',
                        'NO_CAPACITY',
                        'SPILLING_BACK',
                        'RISKY_TOLERANCE',
                        'LOW_CAPACITY',
                        'DATA_ACTIVITY',
                        'OPTIMAL'
                    ]
                },
                resiliency_status: {
                    type: 'string',
                    enum: [
                        'NOT_ENOUGH_RESOURCES',
                        'RISKY_TOLERANCE',
                        'DATA_ACTIVITY',
                        'OPTIMAL'
                    ]
                },
                quota_status: {
                    type: 'string',
                    enum: [
                        'QUOTA_NOT_SET',
                        'APPROUCHING_QUOTA',
                        'EXCEEDING_QUOTA',
                        'OPTIMAL'
                    ]
                },
                spillover_status: {
                    type: 'string',
                    enum: [
                        'SPILLOVER_DISABLED',
                        'SPILLOVER_ERRORS',
                        'SPILLOVER_ISSUES',
                        'SPILLING_BACK',
                        'OPTIMAL'
                    ]
                }
            }
        },
        bucket_mode: {
            type: 'string',
            enum: [
                'OPTIMAL',
                'SPILLOVER_ISSUES',
                'DATA_ACTIVITY',
                'APPROUCHING_QUOTA',
                'LOW_CAPACITY',
                'RISKY_TOLERANCE',
                'SPILLOVER_NO_CAPACITY',
                'SPILLOVER_NOT_ENOUGH_RESOURCES',
                'SPILLOVER_NOT_ENOUGH_HEALTHY_RESOURCES',
                'SPILLOVER_NO_RESOURCES',
                'SPILLING_BACK',
                'NO_CAPACITY_SPILLOVER_UNSERVICEABLE',
                'NOT_ENOUGH_HEALTHY_RESOURCES_SPILLOVER_UNSERVICEABLE',
                'NOT_ENOUGH_RESOURCES_SPILLOVER_UNSERVICEABLE',
                'NO_RESOURCES_SPILLOVER_UNSERVICEABLE',
                'EXCEEDING_QUOTA',
                'NO_CAPACITY',
                'NOT_ENOUGH_HEALTHY_RESOURCES',
                'NOT_ENOUGH_RESOURCES',
                'NO_RESOURCES'
            ]
        },
        undeletable_bucket_reason: {
            enum: ['LAST_BUCKET', 'NOT_EMPTY'],
            type: 'string',
        },

        event_name: { // Based on AWS: https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html#supported-notification-event-types
            enum: ['ObjectCreated', 'ObjectRemoved', /* 'ObjectCreated:Put', 'ObjectCreated:CompleteMultipartUpload', ... */ ],
            type: 'string',
        },

        new_lambda_trigger: {
            type: 'object',
            required: ['bucket_name', 'event_name', 'func_name'],
            properties: {
                bucket_name: {
                    type: 'string'
                },
                event_name: {
                    $ref: '#/definitions/event_name'
                },
                func_name: {
                    type: 'string'
                },
                func_version: {
                    type: 'string'
                },
                enabled: {
                    type: 'boolean',
                },
                object_prefix: {
                    type: 'string'
                },
                object_suffix: {
                    type: 'string'
                },
            }
        },

        update_lambda_trigger: {
            type: 'object',
            required: ['id'],
            properties: {
                id: {
                    objectid: true
                },
                bucket_name: {
                    type: 'string'
                },
                event_name: {
                    $ref: '#/definitions/event_name'
                },
                func_name: {
                    type: 'string'
                },
                func_version: {
                    type: 'string'
                },
                enabled: {
                    type: 'boolean',
                },
                object_prefix: {
                    type: 'string'
                },
                object_suffix: {
                    type: 'string'
                },
            }
        },

        lambda_trigger_info: {
            type: 'object',
            required: ['id', 'event_name', 'func_name'],
            properties: {
                id: {
                    objectid: true
                },
                event_name: {
                    $ref: '#/definitions/event_name'
                },
                func_name: {
                    type: 'string'
                },
                func_version: {
                    type: 'string'
                },
                enabled: {
                    type: 'boolean',
                },
                permission_problem: {
                    type: 'boolean',
                },
                last_run: {
                    idate: true
                },
                object_prefix: {
                    type: 'string'
                },
                object_suffix: {
                    type: 'string'
                },
            }
        },
    }
};
