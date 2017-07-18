/* Copyright (C) 2016 NooBaa */
/**
 *
 * HOST API
 *
 */
'use strict';


module.exports = {

    id: 'host_api',

    methods: {


        read_host: {
            method: 'GET',
            params: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: {
                        type: 'string'
                    },
                },
            },
            reply: {
                $ref: '#/definitions/host_info'
            },
            auth: {
                system: 'admin'
            }
        },

        list_hosts: {
            method: 'GET',
            params: {
                type: 'object',
                // required: [],
                properties: {
                    query: {
                        $ref: '#/definitions/hosts_query'
                    },
                    skip: {
                        type: 'integer'
                    },
                    limit: {
                        type: 'integer'
                    },
                    sort: {
                        type: 'string',
                        enum: [
                            'name',
                            'ip',
                            'online',
                            'used',
                            'trusted',
                            'accessibility',
                            'connectivity',
                            'data_activity',
                            'mode',
                            'pool',
                            'services',
                            'recommended'
                        ]
                    },
                    order: {
                        type: 'integer',
                    },
                    recommended_hint: {
                        type: 'string'
                    }
                }
            },
            reply: {
                type: 'object',
                required: ['hosts'],
                properties: {
                    counters: {
                        type: 'object',
                        properties: {
                            non_paginated: {
                                type: 'integer'
                            },
                            by_mode: {
                                $ref: 'node_api#/definitions/mode_counters'
                            }
                        }
                    },
                    hosts: {
                        type: 'array',
                        items: {
                            $ref: '#/definitions/host_info'
                        }
                    }
                }
            },
            auth: {
                system: 'admin'
            }
        },

        update_host_services: {
            method: 'POST',
            params: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: {
                        type: 'string'
                    },
                    services: {
                        type: 'object',
                        properties: {
                            storage: {
                                type: 'boolean'
                            },
                            s3: {
                                type: 'boolean'
                            }
                        }
                    },
                    nodes: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: ['name', 'enabled'],
                            properties: {
                                name: {
                                    type: 'string',
                                },
                                enabled: {
                                    type: 'boolean'
                                }
                            }
                        }
                    }
                }
            },
            auth: {
                system: 'admin'
            }
        },


        migrate_hosts_to_pool: {
            method: 'POST',
            params: {
                type: 'object',
                required: ['hosts', 'pool_id'],
                properties: {
                    hosts: {
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    },
                    pool_id: {
                        type: 'string'
                    },
                },
            },
            auth: {
                system: 'admin'
            }
        },


        get_test_hosts: {
            method: 'GET',
            params: {
                type: 'object',
                required: ['count', 'source'],
                properties: {
                    count: {
                        type: 'integer',
                    },
                    source: {
                        type: 'string',
                    },
                }
            },
            reply: {
                type: 'array',
                items: {
                    type: 'object',
                    required: ['name', 'rpc_address'],
                    properties: {
                        name: {
                            type: 'string'
                        },
                        rpc_address: {
                            type: 'string'
                        }
                    }
                }
            },
            auth: {
                system: 'admin',
            }
        },

        set_debug_host: {
            method: 'POST',
            params: {
                type: 'object',
                required: ['name', 'level'],
                properties: {
                    name: {
                        type: 'string'
                    },
                    level: {
                        type: 'integer',
                    }
                },
            },
            auth: {
                system: 'admin',
            }
        },

        diagnose_host: {
            method: 'POST',
            params: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: {
                        type: 'string'
                    }
                }
            },
            reply: {
                type: 'string'
            },
            auth: {
                system: 'admin',
            }
        }

    },


    definitions: {

        host_info: {
            type: 'object',
            required: ['name', 'storage_nodes_info', 's3_nodes_info'],
            properties: {
                name: {
                    type: 'string'
                },
                host_id: {
                    type: 'string'
                },
                pool: {
                    type: 'string'
                },
                geolocation: {
                    type: 'string'
                },
                ip: {
                    type: 'string'
                },
                base_address: {
                    type: 'string'
                },
                version: {
                    type: 'string'
                },
                version_install_time: {
                    format: 'idate'
                },
                last_communication: {
                    format: 'idate'
                },
                trusted: {
                    type: 'boolean',
                },
                connectivity: {
                    $ref: 'node_api#/definitions/connectivity_type'
                },
                storage: {
                    $ref: 'common_api#/definitions/storage_info'
                },
                os_info: {
                    $ref: 'common_api#/definitions/os_info'
                },
                latency_to_server: {
                    $ref: 'node_api#/definitions/latency_array'
                },
                debug: {
                    type: 'object',
                    required: ['level'],
                    properties: {
                        level: {
                            type: 'integer',
                        },
                        time_left: { // in ms
                            type: 'integer'
                        },
                    },
                },
                rpc_address: {
                    type: 'string'
                },
                port_range: {
                    $ref: 'common_api#/definitions/port_range_config'
                },
                suggested_pool: {
                    type: 'string'
                },
                mode: {
                    $ref: '#/definitions/host_mode'
                },
                storage_nodes_info: {
                    type: 'object',
                    properties: {
                        mode: {
                            $ref: '#/definitions/storage_nodes_mode'
                        },
                        enabled: {
                            type: 'boolean'
                        },
                        nodes: {
                            type: 'array',
                            items: {
                                $ref: 'node_api#/definitions/node_info'
                            }
                        },
                        data_activities: {
                            $ref: 'node_api#/definitions/data_activities'
                        }
                    }
                },
                s3_nodes_info: {
                    type: 'object',
                    properties: {
                        mode: {
                            $ref: '#/definitions/s3_nodes_mode'
                        },
                        enabled: {
                            type: 'boolean'
                        },
                        nodes: {
                            type: 'array',
                            items: {
                                $ref: 'node_api#/definitions/node_info'
                            }
                        }
                    }
                },
            }
        },

        storage_nodes_mode: {
            type: 'string',
            enum: [
                'OFFLINE',
                'DECOMMISSIONED',
                'DECOMMISSIONING',
                'UNTRUSTED',
                'DETENTION',
                'HAS_ISSUES',
                'NO_CAPACITY',
                'DATA_ACTIVITY',
                'LOW_CAPACITY',
                'INITALIZING',
                'MEMORY_PRESSURE',
                'OPTIMAL',
            ]
        },

        s3_nodes_mode: {
            type: 'string',
            enum: [
                'OFFLINE',
                'DECOMMISSIONED',
                'HTTP_SRV_ERRORS',
                'INITALIZING',
                'OPTIMAL',
            ]
        },

        host_mode: {
            type: 'string',
            enum: [
                'OFFLINE',
                'UNTRUSTED',
                'DECOMMISSIONED',
                'DECOMMISSIONING',
                'DATA_ACTIVITY',
                'HAS_ISSUES',
                'MEMORY_PRESSURE',
                'INITALIZING',
                'OPTIMAL',
            ]
        },


        host_service_update: {
            type: 'object',
            properties: {
                enabled: {
                    type: 'boolean'
                },
                nodes: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['name', 'enabled'],
                        properties: {
                            name: {
                                type: 'string',
                            },
                            enabled: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        },

        hosts_query: {
            type: 'object',
            properties: {
                hosts: {
                    type: 'array',
                    items: {
                        type: 'string',
                    }
                },
                pools: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
                filter: {
                    // regexp on name & ip
                    type: 'string'
                },
                mode: {
                    type: 'array',
                    items: {
                        $ref: '#/definitions/host_mode'
                    }
                }
            },
        },

        hosts_aggregate_info: {
            $ref: 'node_api#/definitions/nodes_aggregate_info'
        }
    }

};
