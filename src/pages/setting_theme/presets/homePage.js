import { bottomBarJson } from './layout'

const homePageJson = {
	type: 'div',
	props: {
		style: {
			display: 'flex',
			flexDirection: 'column',
			height: '100dvh',
			width: '100%',
			overflow: 'hidden',
		},
		children: [
			// Navbar
			{
				// Navbar
				type: 'div',
				props: {
					style: {
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						width: '100%',
						backgroundColor: 'pink',
						height: 56,
						zIndex: 900,
						boxSizing: 'border-box',
					},
					children: [
						{
							// Navbar

							type: 'div',
							props: {
								style: {
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									width: '100%',
									backgroundColor: '#ffffff',
									height: 56,
									color: '#00000059',
									boxShadow: '0px 3px 5px rgba(0,0,0,0.1)',
									boxSizing: 'border-box',
								},
								children: 'ເລືອກເມນູອາຫານ',
							},
						},
					],
				},
			},

			// content
			{
				// content
				type: 'div',
				props: {
					style: {
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						// gridTemplateColumns: '120px 1fr',
						// overflowY: 'scroll',
						overflowX: 'scroll',
						position: 'relative',
						padding: '5px 10px',
						gap: 10,
					},
					children: [
						{
							type: 'div',
							props: {
								style: {
									position: 'relative',
								},

								children: [
									{
										type: 'div',
										props: {
											style: {
												width: '100%',
												height: '120px',
												backgroundColor: '#fff',
												boxShadow: '3px 3px 10px rgba(0,0,0,0.2)',
												borderRadius: 8,
												justifyContent: 'center',
												alignItems: 'center',
												display: 'flex',
												color: '#00000059',
												overflow: 'hidden',
											},

											children: {
												type: 'img',
												props: {
													style: {
														width: '100%',
														objectFit: 'cover',
														height: '100%',
													},
													src: 'https://scontent.fvte3-1.fna.fbcdn.net/v/t39.30808-6/375048265_681998207309858_3203113202464549604_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=52f669&_nc_eui2=AeGcU1mJxYtqF-dTsX_08XYjQhOdWiUpZZBCE51aJSllkPDjqeLEqJKCHyjf3RZ7W4KQO8Ybyhqm1L4luTwalOVk&_nc_ohc=lkVCuY0ArbIAX8BwnKi&_nc_zt=23&_nc_ht=scontent.fvte3-1.fna&oh=00_AfBC7FVzVsQ-DrwMMs5p-QAtnVREaH8JaHQNq9Mxkpo5Aw&oe=6502EE22',
												},
											},
										},
									},
								],
							},
						},

						{
							type: 'div',
							props: {
								style: {
									boxSizing: 'border-box',
									width: '100%',
									boxShadow: '3px 3px 5px rgba(0,0,0,0.2)',
									border: '1px solid orange',
									borderRadius: 8,
									padding: '8px',
									// gridTemplateColumns: 'repeat(3,auto)',
									display: {
										isJS: true,
										__key:
											'defualtAppZap?.menusRecommended?.length==0?"none":"block"',
									},
								},
								children: [
									{
										type: 'div',
										props: {
											style: {
												display: 'flex',
												alignItems: 'center',
												gap: 10,
											},
											children: [
												{
													type: 'i',
													props: {
														className: 'fa-solid fa-fire',
													},
												},
												'ເມນູແນະນຳ',
											],
										},
									},
									{
										type: 'div',
										props: {
											style: {
												gap: 2,
												width: '100%',
												overflowX: 'scroll',
												'scroll-padding': 0,
												display: 'flex',
											},
											children: {
												isJSArray: true,
												__array: 'defualtAppZap?.menusRecommended',
												__item: {
													type: 'div',
													props: {
														style: {
															minWidth: '150px',
															width: '150px',
															maxWidth: '150px',
															overflow: 'hidden',
															display: 'flex',
															border: '2px solid orange',
															backgroundColor: 'orange',
															color: '#fff',
															borderRadius: 4,
														},
														onClick: {
															isJS: true,
															__key:
																'()=>{defualtAppZap?.NavigateToDetail("[[item._id]]");}',
														},
														children: [
															{
																type: 'div',
																props: {
																	style: {
																		width: '100%',
																		display: 'flex',
																	},
																	children: [
																		{
																			type: 'div',
																			props: {
																				style: {
																					width: '100%',
																					height: 60,
																					minWidth: 60,
																					width: 60,
																					maxWidth: 60,
																					borderRadius: 4,
																					overflow: 'hidden',
																				},
																				children: [
																					{
																						type: 'img',
																						props: {
																							src: 'https://appzapimglailaolab.s3-ap-southeast-1.amazonaws.com/resized/small/[[item.images.[0]]]',
																							style: {
																								width: '100%',
																								height: '100%',
																								objectFit: 'cover',
																							},
																						},
																					},
																				],
																			},
																		},
																		{
																			type: 'div',
																			props: {
																				style: {
																					width: '100%',
																					maxWidth: 120,
																					padding: 2,
																					overflowWrap: 'break-word',
																				},
																				children: [
																					{
																						type: 'div',
																						props: {
																							style: {
																								whiteSpace: 'nowrap',
																								overflow: 'hidden',
																								textOverflow: 'ellipsis',
																							},
																							children: '[[item.name]]',
																						},
																					},
																					{
																						type: 'div',
																						props: {
																							style: {
																								whiteSpace: 'nowrap',
																								overflow: 'hidden',
																								textOverflow: 'ellipsis',
																							},
																							children: '[[item.price]]',
																						},
																					},
																				],
																			},
																		},
																	],
																},
															},
														],
													},
												},
											},
										},
									},
								],
							},
						},

						{
							// category
							type: 'div',
							props: {
								style: {
									// height:60,
									width: '100%',
									overflowX: 'scroll',
									zIndex: 10,
									display: 'flex',
								},
								children: [
									{
										type: 'div',
										props: {
											style: {
												width: '100%',
												padding: '10px 10px',
												backgroundColor: {
													isJS: true,
													__key:
														'defualtAppZap?.selectMenuCategoryId == "ALL"?"orange":"white"',
												},
												borderRadius: 8,
												justifyContent: 'center',
												alignItems: 'center',
												display: 'flex',
												fontWeight: 'bold',
												color: {
													isJS: true,
													__key:
														'defualtAppZap?.selectMenuCategoryId == "ALL"?"white":"#000"',
												},
												fontSize: 14,
											},
											onClick: {
												isJS: true,
												__key:
													"()=>{defualtAppZap?.ChangeSelectMenuCategoryId('ALL')}",
											},
											children: {
												type: 'div',
												props: {
													style: {
														width: '100%',
														whiteSpace: 'nowrap',
													},
													children: 'ເມນູທັງໝົດ',
												},
											},
										},
									},
									{
										isJSArray: true,
										__array: 'defualtAppZap?.menuCategory',
										__item: {
											type: 'div',
											props: {
												style: {
													width: '100%',
													padding: '10px 10px',
													borderRadius: 8,
													justifyContent: 'center',
													alignItems: 'center',
													backgroundColor: '[[item.background]]',
													color: '[[item.color]]',
													display: 'flex',
													fontWeight: 'bold',
													fontSize: 14,
												},

												onClick: {
													isJS: true,
													__key:
														"()=>{defualtAppZap?.ChangeSelectMenuCategoryId('[[item._id]]')}",
												},
												children: {
													type: 'div',

													props: {
														style: {
															width: '100%',
															whiteSpace: 'nowrap',
															// overflow: 'hidden',
															// textOverflow: 'ellipsis',
														},
														children: '[[item.name]]',
													},
												},
											},
										},
									},
								],
							},
						},

						{
							// menu
							type: 'div',
							props: {
								style: {
									// boxShadow: '3px 0px 5px rgba(0,0,0,0.1)',
									width: '100%',
									backgroundColor: '#ffffff',
									color: '#00000059',
									position: 'relative',
								},
								children: {
									type: 'div',
									props: {
										style: {
											gap: 4,
											padding: 4,
											boxSizing: 'border-box',
											position: 'absolute',
											width: '100%',
											overflow: 'hidden',
											display: 'grid',
											gridTemplateColumns: 'repeat(3,1fr)',
										},
										children: {
											isJSArray: true,
											__array: 'defualtAppZap?.menus',
											__item: {
												type: 'div',
												props: {
													style: {
														width: '100%',
														maxWidth: '100%',
														overflow: 'hidden',
													},
													onClick: {
														isJS: true,
														__key:
															'()=>{defualtAppZap?.NavigateToDetail("[[item._id]]");}',
													},
													children: [
														{
															type: 'div',
															props: {
																style: {
																	width: '100%',
																	border: '1px solid orange',
																	borderRadius: 4,
																	overflow: 'hidden',
																},
																children: [
																	{
																		type: 'div',
																		props: {
																			style: {
																				width: '100%',
																				height: 80,
																			},
																			children: [
																				{
																					type: 'img',
																					props: {
																						src: 'https://appzapimglailaolab.s3-ap-southeast-1.amazonaws.com/resized/small/[[item.images.[0]]]',
																						style: {
																							width: '100%',
																							height: '100%',
																							objectFit: 'cover',
																						},
																					},
																				},
																			],
																		},
																	},
																	{
																		type: 'div',
																		props: {
																			style: {
																				width: '100%',
																				padding: 2,
																				color: '#000',
																				fontSize: 12,
																				overflowWrap: 'break-word',
																			},
																			children: [
																				{
																					type: 'div',
																					props: {
																						style: {
																							whiteSpace: 'nowrap',
																							overflow: 'hidden',
																							textOverflow: 'ellipsis',
																						},
																						children: '[[item.name]]',
																					},
																				},
																				{
																					type: 'div',
																					props: {
																						style: {
																							whiteSpace: 'nowrap',
																							overflow: 'hidden',
																							textOverflow: 'ellipsis',
																							color: 'orange',
																							fontWeight: 'bold',
																							fontSize: 12,
																						},
																						children: '[[item.price]]',
																					},
																				},
																			],
																		},
																	},
																],
															},
														},
													],
												},
											},
										},
									},
								},
							},
						},
					],
				},
			},

			// Bottom bar
			bottomBarJson,
		],
	},
}

export default homePageJson
