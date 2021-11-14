/**
 * Fetches a resource from the server and displays it in the page.
 *
 * @param {string} url The URL of the resource to fetch.
 * @param {string} tag The tag to use to display the resource.
 *
 */
function fetchResource(url, tag, position) {
	return fetch(url).then(response => response.text()).then(resource => {
		document.getElementsByTagName(tag)[0].insertAdjacentHTML(position, resource);
	}).catch(error => {
		console.log(error);
	});
}

/**
 * Fetches a resource from the server and displays it in the page.
 *
 * @param {string} url The URL of the resource to fetch.
 * @param {string} tag The tag to use to display the resource.
 *
 */
async function writeResource(url, id) {
	try
	{
		const response = await fetch(url);
		const resource = await response.text();
		document.getElementById(id).innerHTML = resource;
	} catch (error)
	{
		console.log(error);
	}
}

//Fetches the page head, header, main, and footer
fetchResource('/lib/header/meta.html', 'title', 'beforebegin');
fetchResource('/lib/header/link.html', 'title', 'afterend');
fetchResource('/lib/header/header.html', 'header', 'beforeend');
fetchResource('/lib/contents/main.html', 'main', 'beforeend');
fetchResource('/lib/footer/footer.html', 'footer', 'beforeend');

//load bio in main on the index page
writeResource('/lib/contents/projects.html', 'projects-wrapper');
// writeResource('/lib/contents/posts.html', 'blog');
writeResource('/lib/contents/form.html', 'contact');
writeResource('/lib/contents/bio.html', 'about');

// write the resource base on the id
function writeResourceById(id) {
	writeResource('/lib/contents/' + id + '.html', id);
}

document.getElementById('currentYear').innerHTML = new Date().getFullYear();
