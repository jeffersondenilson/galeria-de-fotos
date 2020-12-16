import $ from 'jquery';

const onLoadHtmlSuccessCallbacks = [];
// para deploy no github
const modoDev = process.env.NODE_ENV !== 'production';
const urlPrefix = modoDev ? '' : '/galeria-de-fotos';

export function onLoadHtmlSuccess(callback){
	if(!onLoadHtmlSuccessCallbacks.includes(callback)){
		onLoadHtmlSuccessCallbacks.push(callback);
	}
}

// procura por 'wm-include' dentro do elemento parent
function loadIncludes(parent){
	if (!parent) parent = 'body';
	$(parent).find('[wm-include]').each((i, e)=>{
		const url = urlPrefix + $(e).attr('wm-include');
		$.ajax({
			url,
			success(data){
				// substitui src das imagens em produção
				if(!modoDev && data.includes('src="/imgs')){
					data = data.replaceAll('src="/imgs', `src="${urlPrefix}/imgs`);
				}
				$(e).html(data);// insere html do wm-include
				$(e).removeAttr('wm-include');// remove p/ não ser encontrado novamente
				// executa callbacks quando o html é carregado
				// permite executar funções quando a página é carregada através do wm-include
				onLoadHtmlSuccessCallbacks.forEach(callback => callback(data));
				// procura novamente no conteúdo carregado
				loadIncludes(e);
			}
		});
	});
}

loadIncludes();