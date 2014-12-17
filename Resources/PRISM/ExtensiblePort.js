/**
 * Created by felicitia on 12/10/14.
 */

/**
 * A subclass of Port provides extra functionality on top of Port object.
 * Extra capability can be selected by installing the appropriate extension.
 * Installation of appropriate extension can be done by done by setting the
 * appropriate interface to the implementation of extensions. There are access
 * methods provided to allow installation of these extensions.
 * */

 var prism = prism || {};

prism.core = prism.core || {};

prism.extension = prism.extension || {};

prism.extension.extensiblePort = prism.extension.extensiblePort || new prism.core.port;

/**
 * This constructor instantiates an ExtensiblePort object and sets its
 * parent's pointer to itself.
 * @param pPortType      Type of the port. For example: Request, Reply, ..
 * @param pBrick         Parent Brick of this port. For example: component,..
 */
prism.extension.extensiblePort = function(name, pPortType){

};