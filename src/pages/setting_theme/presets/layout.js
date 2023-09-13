export const bottomBarJson = {
	// Bottom bar
	type: 'div',
	props: {
		style: {
			display: 'grid',
			gridTemplateColumns: 'repeat(4,1fr)',
			width: '100%',
			height: 56,
			boxShadow: '0px -3px 5px rgba(0,0,0,0.1)',
			zIndex: 900,
		},
		children: [
			...[
				{ icon: '🍱', page: 'HOME' },
				{ icon: '🧾', page: 'BILL' },
				{ icon: '💬', page: 'QR' },
			].map((e) => ({
				type: 'div',
				props: {
					style: {
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						width: '100%',
						backgroundColor: '#ffffff',
						height: 56,
						fontSize: 24,
					},
					onClick: {
						isJS: true,
						__key: `()=>{defualtAppZap?.setTab("${e?.page}")}`,
					},
					children: e?.icon,
				},
			})),
			{
				type: 'div',
				props: {
					style: {
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						width: '100%',
						backgroundColor: '#ffffff',
						height: 56,
						fontSize: 24,
						position: 'relative',
					},
					onClick: {
						isJS: true,
						__key: '()=>{defualtAppZap?.setTab("CART")}',
					},
					children: [
						{
							type: 'div',
							props: {
								children: '🛒',
							},
						},
						// {
						// 	type: 'div',
						// 	props: {
						// 		style: {
						// 			top: 0,
						// 			left: 10,
						// 			position: 'absolute',
						// 			backgroundColor: 'rgb(145 74 5)',
						// 			padding: '2px 10px',
						// 			color: 'white',
						// 			borderRadius: 4,
						// 			fontSize: 12,
						// 			fontWeight: 'bold',
						// 			display: {
						// 				isJS: true,
						// 				__key: 'defualtAppZap?.showCartNum()',
						// 			},
						// 		},
						// 		children: {
						// 			isJS: true,
						// 			__key:
						// 				'defualtAppZap?.converMoney(defualtAppZap?.cartLength?.num)',
						// 		},
						// 	},
						// },
					],
				},
			},
		],
	},
}
