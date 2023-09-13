import { bottomBarJson } from './layout'

const myBillPageJson = {
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
					children: {
						isJSArray: true,
						__array: 'defualtAppZap?.myBill?.orderId',
						__item: {
							type: 'div',
							props: {
								style: {
									width: '100%',
									border: '1px solid #ccc',
									borderWidth: '0 0 1px 0',
									display: 'grid',
									gridTemplateColumns: 'auto 1fr',
									padding: 8,
								},
								children: [
									{
										type: 'div',
										props: {
											style: {
												width: '60px',
												height: '60px',
												backgroundColor: '#CCC',
												borderRadius: 8,
												overflow: 'hidden',
											},
											children: {
												type: 'img',
												props: {
													src: 'https://appzapimglailaolab.s3-ap-southeast-1.amazonaws.com/resized/small/[[item.menuImage]]',
													style: {
														width: '100%',
														height: '100%',
														objectFit: 'cover',
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
												padding: '0 8px',
											},
											children: [
												{
													type: 'div',
													props: {
														style: {},
														children: '[[item.name]]',
													},
												},
												{
													type: 'div',
													props: {
														style: {},
														children: 'ຈຳນວນ [[item.quantity]]',
													},
												},
												{
													type: 'div',
													props: {
														style: {
															color: 'green',
														},
														children: '[[item.status]]',
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
			{
				// content
				type: 'div',
				props: {
					style: {
						// height: '56px',
						backgroundColor: '#fff',
						display: 'flex',
						boxShadow: '0px -6px 5px rgba(0,0,0,0.1)',
						flexDirection: 'column',
						padding: 20,
					},
					children: [
						{
							// content
							type: 'div',
							props: {
								style: {
									width: '100%',
									display: 'flex',
									justifyContent: 'space-between',
									border: '1px dotted #ccc',
									borderWidth: '0 0 1px 0',
									padding: '10px 0',
								},
								children: [
									{
										// content
										type: 'div',
										props: {
											style: {
												// width: '100%',
											},
											children: 'ຈຳນວນລາຍງານ :',
										},
									},
									{
										// content
										type: 'div',
										props: {
											style: {},
											children: {
												isJS: true,
												__key: 'defualtAppZap?.myBill?.orderId?.length',
											},
										},
									},
								],
							},
						},
						{
							// content
							type: 'div',
							props: {
								style: {
									width: '100%',
									display: 'flex',
									justifyContent: 'space-between',
									border: '1px dotted #ccc',
									borderWidth: '0 0 1px 0',
									padding: '10px 0',
								},
								children: [
									{
										// content
										type: 'div',
										props: {
											style: {
												// width: '100%',
											},
											children: 'ຈຳນວນອໍເດີ :',
										},
									},
									{
										// content
										type: 'div',
										props: {
											style: {},
											children: {
												isJS: true,
												__key:
													'_.sumBy(defualtAppZap?.myBill?.orderId,(e)=>e.quantity)',
											},
										},
									},
								],
							},
						},
						{
							// content
							type: 'div',
							props: {
								style: {
									width: '100%',
									display: 'flex',
									justifyContent: 'space-between',
									border: '1px dotted #ccc',
									borderWidth: '0 0 1px 0',
									padding: '10px 0',
								},
								children: [
									{
										// content
										type: 'div',
										props: {
											style: {
												// width: '100%',
											},
											children: 'ລາຄາລວມ :',
										},
									},
									{
										// content
										type: 'div',
										props: {
											style: {},
											children: {
												isJS: true,
												__key:
													'defualtAppZap?.converMoney(_.sumBy(defualtAppZap?.myBill?.orderId,(e)=>e.quantity*e.price)) + " ₭"',
											},
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

export default myBillPageJson
