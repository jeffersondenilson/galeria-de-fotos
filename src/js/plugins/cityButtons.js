import $ from 'jquery';
import { onLoadHtmlSuccess } from '../core/includes';

const duration = 300;

// mostra apenas imagens com wm-city = city ou todas se city = null
function filterByCity(city, buttonClicked){
	// adiciona classe 'active' no botão clicado
	$('[wm-city-buttons] button.active').removeClass('active');
	$(buttonClicked).addClass('active');

	$('[wm-city]').each(function(i, e){
		const isTarget = $(this).attr('wm-city') === city || city === null;
		if(isTarget){// mostra imagens com a cidade
			$(this).parent().removeClass('d-none');
			$(this).fadeIn(duration);
		}else{// esconde as outras
			$(this).fadeOut(duration, () => {
				$(this).parent().addClass('d-none');
			});
			
		}
	});
}

// cria botões para mostrar imagens por cidade
$.fn.cityButtons = function(){
	// juntar valores diferentes do 'wm-city'
	const cities = new Set();
	$('[wm-city]').each(function(i, e){
		cities.add($(e).attr('wm-city'));
	});
	// criar buttons com base em cities
	const btns = Array.from(cities).map(city => {
		const btn = $('<button>').addClass(['btn', 'btn-info']).html(city);
		btn.click(e => filterByCity(city, e.target));
		return btn;
	});
	// button para mostrar todas as imagens
	const btnAll = $('<button>').addClass(['btn', 'btn-info', 'active']).html('Todas');
	btnAll.click(e => filterByCity(null, e.target));
	btns.push(btnAll);

	const btnGroup = $('<div>').addClass(['btn-group']);
	btnGroup.append(btns);

	$(this).html(btnGroup);
	return this;
}

onLoadHtmlSuccess(function(){
	// executado quando conteúdo é carregado através do wm-include
	$('[wm-city-buttons]').cityButtons();
});