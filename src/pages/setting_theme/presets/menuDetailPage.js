import { bottomBarJson } from './layout'

const menuDetailPageJson = {
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
									justifyContent: 'flex-start',
									alignItems: 'center',
									width: '100%',
									backgroundColor: '#ffffff',
									height: 56,
									color: '#00000059',
									boxShadow: '0px 3px 5px rgba(0,0,0,0.1)',
									boxSizing: 'border-box',
								},
								children: {
									type: 'div',
									props: {
										onClick: {
											isJS: true,
											__key: '()=>{defualtAppZap?.setTab("HOME");}',
										},
										style: {
											width: '60px',
											height: '100%',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											border: '1px solid rgba(0,0,0,0.1)',
											backgroundColor: 'rgba(0,0,0,0.1)',
										},
										children: {
											type: 'i',
											props: {
												className: 'fa-solid fa-angle-left',
											},
										},
									},
								},
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
						overflowY: 'scroll',
						overflowX: 'hidden',
					},
					children: [
						{
							// category
							type: 'div',
							props: {
								style: {
									width: '100%',
									backgroundColor: '#ffffff',
									height: '100%',
									overflowY: 'scroll',
									overflowX: 'hidden',
									padding: '10px',
								},
								children: [
									{
										type: 'div',
										props: {
											style: {
												backgroundColor: 'rgba(0,0,0,0.1)',
												width: '100%',
												marginBottom: 10,
												height: 150,
											},
											children: {
												type: 'img',
												props: {
													style: {
														backgroundColor: 'rgba(0,0,0,0.1)',
														width: '100%',
														height: '100%',
														objectFit: 'cover',
													},
													src: {
														isJS: true,
														__key:
															'"https://appzapimglailaolab.s3-ap-southeast-1.amazonaws.com/resized/small/"+defualtAppZap?.selectMenuDetail?.images?.[0]',
													},
												},
											},
										},
									},
									{
										type: 'div',
										props: {
											style: {
												width: '100%',
												marginBottom: 10,
											},
											children: {
												isJS: true,
												__key: 'defualtAppZap?.selectMenuDetail?.name',
											},
										},
									},
									{
										type: 'div',
										props: {
											style: {
												width: '100%',
												marginBottom: 10,
											},
											children: {
												isJS: true,
												__key:
													'defualtAppZap?.converMoney(defualtAppZap?.selectMenuDetail?.price)',
											},
										},
									},
									{
										type: 'div',
										props: {
											style: {
												width: '100%',
												marginBottom: 10,
												display: 'flex',
												justifyContent: 'center',
												gap: 10,
											},
											children: [
												{
													type: 'div',
													props: {
														onClick: {
															isJS: true,
															__key: '()=>{defualtAppZap?.ChangeQuantity(-1)}',
														},
														style: {
															marginBottom: 10,
															width: 40,
															height: 40,
															backgroundColor: 'rgba(0,0,0,0.1)',
															display: 'flex',
															justifyContent: 'center',
															alignItems: 'center',
															borderRadius: 8,
															border: '1px solid rgba(0,0,0,0.1)',
														},
														children: {
															type: 'i',
															props: {
																className: 'fa-solid fa-minus',
															},
														},
													},
												},
												{
													type: 'div',
													props: {
														style: {
															marginBottom: 10,
															width: 70,
															display: 'flex',
															justifyContent: 'center',
															alignItems: 'center',
														},
														children: {
															isJS: true,
															__key:
																'defualtAppZap?.converMoney(defualtAppZap?.selectMenuDetail?.quantity)',
														},
													},
												},
												{
													type: 'div',
													props: {
														onClick: {
															isJS: true,
															__key: '()=>{defualtAppZap?.ChangeQuantity(1)}',
														},
														style: {
															marginBottom: 10,
															width: 40,
															height: 40,
															backgroundColor: 'rgba(0,0,0,0.1)',
															display: 'flex',
															justifyContent: 'center',
															alignItems: 'center',
															borderRadius: 8,
															border: '1px solid rgba(0,0,0,0.1)',
														},
														children: {
															type: 'i',
															props: {
																className: 'fa-sharp fa-solid fa-plus',
															},
														},
													},
												},
											],
										},
									},
									{
										type: 'textarea',
										props: {
											style: {
												width: '100%',
												marginBottom: 10,
												backgroundColor: 'rgba(0,0,0,0.1)',
												padding: '10px 10px',
												border: '1px solid rgba(0,0,0,0.1)',
												height: 80,
											},
											children: '',
											onChange: {
												isJS: true,
												__key:
													'(e)=>{defualtAppZap?.changeComment(e.target.value)}',
											},
										},
									},
									{
										type: 'div',
										props: {
											onClick: {
												isJS: true,
												__key: '()=>{defualtAppZap?.AddToCart(1)}',
											},
											style: {
												width: '100%',
												marginBottom: 10,
												backgroundColor: 'rgba(0,0,0,0.1)',
												padding: '10px 20px',
												borderRadius: 8,
												border: '1px solid rgba(0,0,0,0.1)',
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
											},
											children: 'ເພີ່ມເຂົ້າກະຕ່າ',
										},
									},
								],
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

export default menuDetailPageJson
