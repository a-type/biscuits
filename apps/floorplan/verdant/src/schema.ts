import { schema } from '@verdant-web/store';

const floors = schema.collection({
	name: 'floor',
	primaryKey: 'id',
	fields: {
		id: schema.fields.id(),
		createdAt: schema.fields.number({
			default: () => Date.now(),
		}),
		name: schema.fields.string(),
		lines: schema.fields.array({
			items: schema.fields.object({
				fields: {
					id: schema.fields.id(),
					start: schema.fields.object({
						documentation:
							'The start point of the line. Either point or snapKey must be provided.',
						fields: {
							x: schema.fields.number(),
							y: schema.fields.number(),
							snap: schema.fields.object({
								nullable: true,
								fields: {
									lineId: schema.fields.string(),
									side: schema.fields.string({
										options: ['start', 'end'],
									}),
								},
							}),
						},
					}),
					end: schema.fields.object({
						documentation:
							'The end point of the line. Either point or snapKey must be provided.',
						fields: {
							x: schema.fields.number(),
							y: schema.fields.number(),
							snap: schema.fields.object({
								nullable: true,
								fields: {
									lineId: schema.fields.string(),
									side: schema.fields.string({
										options: ['start', 'end'],
									}),
								},
							}),
						},
					}),
					attachments: schema.fields.array({
						documentation: `Objects attached along this wall, like doors or windows.`,
						items: schema.fields.object({
							fields: {
								id: schema.fields.id(),
								start: schema.fields.number(),
								end: schema.fields.number(),
								type: schema.fields.string(),
								direction: schema.fields.string({
									documentation:
										'Reversed flips the outward swing direction of doors, for example',
									options: ['normal', 'reversed'],
								}),
							},
						}),
					}),
				},
			}),
		}),
		labels: schema.fields.array({
			items: schema.fields.object({
				fields: {
					id: schema.fields.id(),
					position: schema.fields.object({
						fields: {
							x: schema.fields.number(),
							y: schema.fields.number(),
						},
					}),
					content: schema.fields.string(),
				},
			}),
		}),
	},
	indexes: {
		createdAt: {
			field: 'createdAt',
		},
	},
});

export default schema({
	version: 1,
	collections: {
		floors,
	},
});
